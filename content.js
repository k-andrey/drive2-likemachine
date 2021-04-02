const likeImg = chrome.runtime.getURL("like.svg");
const banner = `<div id="drive_ext"><img class="like_btn" alt="Like Machine" src="${likeImg}" /></div>`;
const ext = '#drive_ext';
let interval;

$('body').append(banner);

chrome.storage.sync.get(['like_machine_enabled'], ({ like_machine_enabled }) => {
    if (like_machine_enabled) {
        $(ext).addClass('enabled');
        interval = setInterval(likeFn, 1000);
    } else {
        $(ext).removeClass('enabled');
        clearInterval(interval);
    }
});

$(ext).click(() => {
    chrome.storage.sync.get(['like_machine_enabled'], ({ like_machine_enabled }) => {
        if (like_machine_enabled) {
            chrome.storage.sync.set({like_machine_enabled: false}, () => {
                $(ext).removeClass('enabled');
                clearInterval(interval);
            });
        } else {
            chrome.storage.sync.set({like_machine_enabled: true}, () => {
                $(ext).addClass('enabled');
                interval = setInterval(likeFn, 1000);
            });
        }
    });
});

const likeFn = () => {
    const nextPage = '.c-pager__page--active ~ .c-pager__page';
    const likes = '.c-like:not(.is-liked) button.c-like__button';
    if ($(likes).length === 0) {
        if ($(nextPage).length) {
            $(nextPage)[0].scrollIntoView({ behavior: "smooth", block: "center" });
            $(nextPage)[0].click();
            return;
        } else {
            chrome.storage.sync.set({like_machine_enabled: false}, () => {
                $(ext).removeClass('enabled');
                clearInterval(interval);
            });
            return;
        }
    }
    $(likes)[0].scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => $(likes)[0].click(), 500);
}

