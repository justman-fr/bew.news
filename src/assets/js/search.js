(function (window, document) {
    "use strict";
    const search = (e) => {
        const results = window.searchIndex.search(e.target.value, {
            bool: "OR",
            expand: true,
        });
        const searchBox = document.getElementById("searchField");
        const resEl = document.getElementById("searchResults");
        const noResultsEl = document.getElementById("noResultsFound");

        searchBox.addEventListener("focus", (event) => {
            event.target.classList.remove("hidden");
            resEl.classList.remove("hidden");
        });

        document.addEventListener("click", function (event) {
            var isClickInside = searchBox.contains(event.target);
            if (!isClickInside) {
                resEl.classList.add("hidden"), noResultsEl.classList.add("hidden");
                noResultsEl.classList.add("hidden");
            }
        });



        resEl.innerHTML = "";
        searchResult(e, resEl, results, noResultsEl);
    };
    fetch("/search-index.json").then((response) =>
        response.json().then((rawIndex) => {
            window.searchIndex = elasticlunr.Index.load(rawIndex);
            document.getElementById("searchField").addEventListener("input", search);
        })
    );

})(window, document);

(function (window, document) {
    "use strict";
    const search = (e) => {
        const results = window.searchIndex.search(e.target.value, {
            bool: "OR",
            expand: true,
        });
        const searchBox = document.getElementById("searchFieldMobile");
        const resEl = document.getElementById("searchResultsMobile");
        const noResultsEl = document.getElementById("noResultsFound");

        searchBox.addEventListener("focus", (event) => {
            event.target.classList.remove("hidden");
            resEl.classList.remove("hidden");
        });

        document.addEventListener("click", function (event) {
            var isClickInside = searchBox.contains(event.target);
            if (!isClickInside) {
                resEl.classList.add("hidden"), noResultsEl.classList.add("hidden");
                noResultsEl.classList.add("hidden");
            }
        });

        resEl.innerHTML = "";
        searchResult(e, resEl, results, noResultsEl);

    };
    fetch("/search-index.json").then((response) =>
        response.json().then((rawIndex) => {
            window.searchIndex = elasticlunr.Index.load(rawIndex);
            document.getElementById("searchFieldMobile").addEventListener("input", search);
        })
    );

})(window, document);


function searchResult (e, resEl, results, noResultsEl) {
    "use strict";
    if (e.target.value != "") {
        if (results != "") {
            noResultsEl.classList.add("hidden");
            resEl.classList.add("p-4");
            results.map((r) => {
                const {id, title, description} = r.doc;
                const el = document.createElement("li", {tabindex: "-1"});
                resEl.appendChild(el);

                const h3 = document.createElement("h3");
                el.appendChild(h3);

                const a = document.createElement("a");
                a.setAttribute("href", id);
                a.textContent = title;
                h3.appendChild(a);

                const p = document.createElement("p");
                p.textContent = description;
                el.appendChild(p);
            });
        } else {
            noResultsEl.classList.remove("hidden");
        }
    } else {
        noResultsEl.classList.add("hidden");
    }
}

/**
 * Search for mobile
 */
document.addEventListener("DOMContentLoaded", function() {
    "use strict";
    const searchMobile = document.getElementById("searchMobile");
    const hideSearch = document.getElementById("hideSearch");

    searchMobile.addEventListener('click', () => {
        searchMobileAction();
    });

    hideSearch.addEventListener('click', () => {
       searchMobileAction();
    });
});

function searchMobileAction () {
    "use strict";
    const searchMobile = document.getElementById("searchMobile");
    const navigationMobile = document.getElementById("navigationMobile");
    const logoMobile = document.getElementById("logoMobile");
    const elSearchBoxBar = document.getElementById("search-box-bar-mobile");

    logoMobile.classList.toggle("hidden");
    searchMobile.classList.toggle("hidden");
    navigationMobile.classList.toggle("hidden");
    elSearchBoxBar.classList.toggle("hidden");
    elSearchBoxBar.classList.toggle("w-full");
}
