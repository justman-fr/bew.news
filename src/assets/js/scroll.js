document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".scroll, #toc a");

    for (const link of links) {
        link.addEventListener("click", clickHandler);
    }

    function clickHandler(e) {
        e.preventDefault();
        console.log("test");
        const href = this.getAttribute("href");
        console.log(href);
        const offsetTop = document.querySelector(href).offsetTop - 65;
        scroll({
            top: offsetTop,
            behavior: "smooth"
        });
    }

});