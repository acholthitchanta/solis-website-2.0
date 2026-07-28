import podcast1 from "../assets/podcast/podcast1.jpg";
import podcast2 from "../assets/podcast/podcast2.jpg";
import { Placeholder } from "react-bootstrap";
import { useState } from "react";

function PodcastEmbed({title, src}) {
    const [isLoaded, setIsLoaded] = useState(false);
    
    return (
        <div>
            {!isLoaded && (
                <Placeholder as="div" animation="glow" className="episode-cover">
                    <Placeholder xs={12} />
                </Placeholder>
            )}
            
            <iframe
                data-testid="embed-iframe"
                title={title}
                src={src}
                allowFullScreen
                allow={spotifyAllow}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
            ></iframe>
        </div>
    );
}

const playlistSections = [
    {
        id: "arts-mental-wellbeing",
        title: "Arts and Mental Wellbeing",
        embedTitle: "Arts and Mental Wellbeing Spotify playlist",
        src: "https://open.spotify.com/embed/playlist/34qnDbrDFao710PNbtLb81?utm_source=generator&si=9134d876eec04188",
    },
    {
        id: "arts-connection",
        title: "Arts and Connection",
        embedTitle: "Arts and Connection Spotify playlist",
        src: "https://open.spotify.com/embed/playlist/7bdnv6hhG9GO6URscWh3I5?utm_source=generator&si=c951d33002ed4a17",
    },
    {
        id: "arts-healthcare",
        title: "Arts in Healthcare",
        embedTitle: "Arts in Healthcare Spotify playlist",
        src: "https://open.spotify.com/embed/playlist/4vRUn5FmiGIkay3Plgxv0b?utm_source=generator&si=abce2cf1924f48ea",
    },
    {
        id: "redefining-creativity",
        title: "Redefining Creativity",
        embedTitle: "Redefining Creativity Spotify playlist",
        src: "https://open.spotify.com/embed/playlist/2cKi84wvA8dVYizfYTyDS6?utm_source=generator&si=a2fc778a27c543ff",
    },
    {
        id: "highlight-young-leaders-artists",
        title: "Highlighting Young Leaders & Artists",
        embedTitle: "Highlighting Young Leaders & Artists Spotify playlist",
        src: "https://open.spotify.com/embed/playlist/3hislTNAeHPQjeQIAkz28Y?utm_source=generator&si=278ddd23993e40c1",
    },
];

const spotifyAllow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

export default function Podcast() {
  return (
    <main className="podcast-page">
        <section className="podcast-landing">
            <img className="podcast-landing-bg" src={podcast1} alt="" />
            <img className="podcast-landing-logo" src={podcast2} alt="Solis and Luna Arts Podcast" />
        </section>
            
        <section className="light-blue podcast-intro">
            <h1>Welcome to the Solis and Luna Arts Podcast, hosted by Willow Yoo.</h1>
            <p>The podcast, originally started in February 2024, centered on discussions with musicians and music therapists. Since then, we've reached 1.5k+ global impressions and expanded to interviews with 70+ interdisciplinary professionals, artists, and youth leaders about the usage of creativity and the arts for social good, innovation, and wellbeing.</p>
            
            <h4>Recognized by Spotify as...</h4>
            <ul>
                <li>A 2025 Rising Star - our growth outpaced 84% of other shows</li>
                <li>A 2025 Fan Fave - our average rating was higher than 61% of other shows</li>
                <li>A 2025 Most Shared Show - we received more shares than 91% of other shows</li>
            </ul>
        </section>
        
        <section>
            <div className="dark-blue podcast-divider">
                <h2>Some themes we've explored:</h2>
            </div>

            <div className="podcast-category-grid">
                {playlistSections.map((playlist) => (
                    <div className="light-blue podcast-category" key={playlist.id}>
                        <h3>{playlist.title}</h3>
                        
                        <PodcastEmbed
                            title={playlist.embedTitle}
                            src={playlist.src}
                        />
                    </div>
                ))}
            </div>
        </section>
        
        <section>
            <div className="dark-blue podcast-divider">
                <h2>Check out our most recent episode:</h2>
            </div>
            
            <div className="light-blue podcast-category">
                <PodcastEmbed
                    title="Most Recent Episode"
                    src="https://open.spotify.com/embed/show/4nyCM6CHrLnu43uTBFJ3VX?utm_source=generator&si=ca9288b6d6f54f79"
                />
            </div>
        </section>
    </main>
  )
}
