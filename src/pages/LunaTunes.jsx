import { useRef } from 'react'
import Landing from "../components/Landing"
import lunatunes from '../assets/lunatunes/lunatunes.jpg'
import lunatunes2 from '../assets/lunatunes/lunatunes2.jpeg'
import useFitTextToLine from '../hooks/useFitTextToLine'
import useReveal from '../hooks/useReveal'

export default function LunaTunes() {
  const containerRef = useRef(null);
  useReveal(containerRef);

  return (
    <div ref={containerRef}>
      <Landing theme="dark-blue" background="db" landingImg={lunatunes} title={"LUNATUNES"} description={"Our online therapeutic music program brings uplifting music to patients upon request."} />
      <div className="mobile-spacer dark-blue" />

      <div className="lunatunes-row dark-blue lunatunes-row-padded">
        <div className="lunatunes-row-inner">
          <div className="lunatunes-media lunatunes-media-desktop-only reveal">
            <div className="lunatunes-circle-wrap">
              <img src={lunatunes2} alt="Solis members rehearsing" />
            </div>
          </div>
          <div className="lunatunes-text reveal">
            <h1>WHY WE STARTED THIS</h1>
            <p>We understand that some patients cannot leave their hospital rooms for various reasons, ranging from physical challenges to schedules that prevent them from attending our in-person concerts. To address this, we introduced a new program called <strong>LunaTunes: Songs by Request</strong>!</p>
          </div>
        </div>
      </div>

      <div className="lunatunes-row yellow">
        <div className="lunatunes-row-inner">
          <div className="lunatunes-text reveal">
            <h1>HOW IT WORKS</h1>
            <p>Patients will fill out a form online requesting a performance of a piece/song of their choice. Then, each patient will be paired with a Solis member, who will spend a week preparing the piece. Afterwards, the piece will be recorded and sent to the patient!</p>
            <p>Through this program, we strive to make therapeutic arts <strong>accessible to every patient in need</strong>. Additionally, we aim to expand opportunities for students unable to participate in a Solis event in-person but still wish to make an impact on their community.</p>
          </div>
          <div className="lunatunes-media reveal">
            <div className="lunatunes-video-wrap">
              <iframe
                src="https://www.youtube.com/embed/8G1wNB-BdFk"
                title="Stand By Me by Ben E. King"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className="lunatunes-video-caption">Stand By Me (Ben E. King)</p>
          </div>
        </div>
      </div>

      <div className="lunatunes-row light-blue lunatunes-row-padded lunatunes-row-media-bottom-mobile">
        <div className="lunatunes-row-inner">
          <div className="lunatunes-media reveal">
            <div className="lunatunes-video-wrap">
              <iframe
                src="https://www.youtube.com/embed/8S1M8wYfg7k"
                title="Tuesday Afternoon by Moody Blues"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className="lunatunes-video-caption">Tuesday Afternoon (Moody Blues), performed by Edward Lee and Samuel Nakon</p>
          </div>
          <div className="lunatunes-text reveal">
            <h1 className="text-primary">PARTICIPATE NOW!</h1>
            <p>
              <strong>Patients</strong> who would like to request a performance, please fill out{' '}
              <a href="https://forms.gle/DueotrmKkNSZJgvN8" target="_blank" rel="noopener noreferrer">this form</a>.
            </p>
            <p>
              <strong>Musicians</strong> interested in performing for a patient, please fill out an{' '}
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfu0atrlIIb6U3DSDLofcXBaEug8lFev9CBBGJ4EEu74eigBg/viewform" target="_blank" rel="noopener noreferrer">online application</a>.
              {' '}All participating members will receive volunteer hours as well!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
