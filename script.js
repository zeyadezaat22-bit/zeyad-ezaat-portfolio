document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MOBILE NAVIGATION
    ========================= */

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (event) {
            const clickedInsideMenu =
                navigation.contains(event.target) ||
                menuToggle.contains(event.target);

            if (!clickedInsideMenu) {
                navigation.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }


    /* =========================
       VIDEO SLIDERS
    ========================= */

    const sliders = document.querySelectorAll(".video-slider");

    sliders.forEach(function (slider) {

        const video = slider.querySelector(".work-video");
        const source = video
            ? video.querySelector("source")
            : null;

        const previousButton = slider.querySelector(".previous");
        const nextButton = slider.querySelector(".next");
        const counter = slider.querySelector(".slide-counter");

        let videos = [];

        try {
            videos = JSON.parse(slider.dataset.videos);
        } catch (error) {
            console.error(
                "Could not read video list:",
                error
            );

            return;
        }

        if (
            !video ||
            !source ||
            !previousButton ||
            !nextButton ||
            !counter ||
            !Array.isArray(videos) ||
            videos.length === 0
        ) {
            console.error("Video slider setup is incomplete.");
            return;
        }

        let currentIndex = 0;


        function showVideo(index) {

            if (index < 0 || index >= videos.length) {
                return;
            }

            currentIndex = index;

            video.pause();

            source.src = videos[currentIndex];

            video.load();

            counter.textContent =
                (currentIndex + 1) + " / " + videos.length;

            previousButton.disabled = currentIndex === 0;

            nextButton.disabled =
                currentIndex === videos.length - 1;

            video.setAttribute(
                "aria-label",
                "Video " +
                (currentIndex + 1) +
                " of " +
                videos.length
            );
        }


        previousButton.addEventListener("click", function () {
            if (currentIndex > 0) {
                showVideo(currentIndex - 1);
            }
        });


        nextButton.addEventListener("click", function () {
            if (currentIndex < videos.length - 1) {
                showVideo(currentIndex + 1);
            }
        });


        showVideo(0);
    });


    /* =========================
       PAUSE VIDEOS WHEN OFFSCREEN
    ========================= */

    if ("IntersectionObserver" in window) {

        const videoObserver = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {

                        const video =
                            entry.target.querySelector("video");

                        if (video) {
                            video.pause();
                        }
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        sliders.forEach(function (slider) {
            videoObserver.observe(slider);
        });
    }


    /* =========================
       CURRENT YEAR
    ========================= */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

});