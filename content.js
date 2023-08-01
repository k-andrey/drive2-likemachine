const likeImg = chrome.runtime.getURL("like.svg");
const banner = `<div id="drive_ext"><img class="like_btn" alt="Like Machine" src="${likeImg}" /></div>`;
const ext = '#drive_ext';

$('body').append(banner);

chrome.storage.sync.get(['like_machine_enabled'], ({ like_machine_enabled }) => {
    if (like_machine_enabled) {
        $(ext).addClass('enabled');
        likeFn();
    } else {
        $(ext).removeClass('enabled');
    }
});

$(ext).click(() => {
    chrome.storage.sync.get(['like_machine_enabled'], ({ like_machine_enabled }) => {
        if (like_machine_enabled) {
            chrome.storage.sync.set({ like_machine_enabled: false }, () => {
                $(ext).removeClass('enabled');
            });
        } else {
            chrome.storage.sync.set({ like_machine_enabled: true }, () => {
                $(ext).addClass('enabled');
                likeFn();
            });
        }
    });
});

const likeFn = async () => {
    const likes = '.c-like:not(.is-disabled) > button';
    const nextPage = '.c-pager .c-pager__link[rel="next"]';

    const likeButtons = [...$(likes)];

    while (likeButtons.length) {
        const likeBtn = likeButtons.shift();
        likeBtn.scrollIntoView({ behavior: "auto", block: "center" });
        await wait(500);
        likeBtn.click();
        await wait(1000);
    }

    if ($(nextPage).length) {
        $(nextPage)[0].scrollIntoView({ behavior: "auto", block: "center" });
        await wait(500);
        $(nextPage)[0].click();
    } else {
        chrome.storage.sync.set({ like_machine_enabled: false }, () => {
            $(ext).removeClass('enabled');
        });
    }
}

const wait = (t) => new Promise(resolve => { window.setTimeout(resolve, t) });
