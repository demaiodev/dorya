export default function Page() {
    return (
        <div className="flex flex-col gap-12 sm:gap-16">
            <section className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Electric Wind God Fist (EWGF)</h1>
                <p>
                    In the Tekken series, the Electric Wind God Fist (commonly called an &quot;electric&quot; or
                    &quot;EWGF&quot;) is the signature move of the Mishima family. The EWGF has the same input as the
                    regular Wind God Fist, but is a &quot;just frame&quot; version, and will be executed instead of the
                    Wind God Fist if the player inputs the d/f input and the 2 input on the exact same frame.
                </p>
                <p>
                    For characters like Kazuya, mastering the EWGF is essential. Its unique combination of speed,
                    safety, and launching power makes it the cornerstone of high-level Mishima offense, defining their
                    relentless pressure and damage potential. Consistent EWGF execution is a key differentiator in
                    competitive play.
                </p>
                <div className="flex flex-row gap-4 mt-4">
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/hXLVZe4Wjcw?si=VnysZw4xuENWm9V0"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                    ></iframe>
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/Dy2Y_bCnBmc?si=BPKtj1x5QclU5z3x"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                    ></iframe>
                </div>
            </section>
        </div>
    );
}
