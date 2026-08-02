import { useEffect, useId } from 'react'
import '../styles/supportus.scss'
import supportus from '../assets/supportus.jpg'

const FUNRAISE_ORG_ID = '0f310c11-8882-45d5-b412-4b4035fa0272'
const FUNRAISE_FORM_ID = 51238

export default function SupportUs() {
  const FUNRAISE_CONTAINER_ID = `fr-placed-form-container-${useId().replace(/:/g, '')}`

  useEffect(() => {
    if (!document.getElementById('funraise-aware-script')) {
      const awareScript = document.createElement('script')
      awareScript.id = 'funraise-aware-script'
      awareScript.text = `(function(f,u,n,r,a,i,s,e){var data={window:window,document:document,tag:"script",data:"funraise",orgId:f,uri:u,common:n,client:r,script:a};var scripts;var funraiseScript;data.window[data.data]=data.window[data.data]||[];if(data.window[data.data].scriptIsLoading||data.window[data.data].scriptIsLoaded)return;data.window[data.data].loading=true;data.window[data.data].push("init",data);scripts=data.document.getElementsByTagName(data.tag)[0];funraiseScript=data.document.createElement(data.tag);funraiseScript.async=true;funraiseScript.src=data.uri+data.common+data.script+"?orgId="+data.orgId;scripts.parentNode.insertBefore(funraiseScript,scripts)})('${FUNRAISE_ORG_ID}','https://assets.funraise.io','/widget/common/2.0','/widget/client','/inject-form.js');`
      document.head.appendChild(awareScript)
    }

    const configScript = document.createElement('script')
    configScript.text = `window.funraise.push('create', { form: ${FUNRAISE_FORM_ID} }, { selector: '#${FUNRAISE_CONTAINER_ID}', type: 'grow_contained' });`
    document.head.appendChild(configScript)

    return () => {
      configScript.remove()
    }
  }, [])

  return (
    <div>
      <div className="mobile-spacer dark-blue" />
      <div className="section-wide dark-blue">
        <div className="join-row">
          <div className="join-text">
            <h1>JOIN OUR TEAM</h1>
            <p>
              If you're interested in joining an existing chapter OR starting a new one, please fill out{' '}
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSc9HS8UN9xPjKik2ND47Jl7GX09nk1htlY5dzPykkNUAoIIBg/viewform?usp=sharing&ouid=110272117549008627958" target="_blank" rel="noopener noreferrer">this form</a>.
            </p>
            <p>
              Additionally, if you would like to be a part of our many organizational teams (finance, outreach, media, press, and tech), please reach out to{' '}
              <a href="mailto:contact@solisandlunaarts.com">contact@solisandlunaarts.com</a>!
            </p>
          </div>
          <div className="join-image">
            <img src={supportus} alt="Solis and Luna Arts volunteers" />
          </div>
        </div>
      </div>

      <div id="donate" className="section-medium yellow">
          <div className="donate-row">
            <div className="donate-form">
              <div id={FUNRAISE_CONTAINER_ID} style={{ minHeight: '700px' }} />
            </div>
            <div className="donate-text">
              <h1>DONATE</h1>
              <p>Help us serve more communities by making a donation to Solis and Luna Arts! Every contribution directly supports our mission by helping us:</p>
              <ul>
                <li><strong>Launch new therapeutic arts programs</strong> like Neurographic Art, Therapeutic Nail Art, Floral Therapy, and more!</li>
                <li><strong>Expand therapeutic music in communities</strong> by bringing live performances, personalized songs, and interactive activities to more venues around the world</li>
                <li><strong>Train and support youth volunteers</strong> as young as eight with educational resources, leadership development, and materials that will allow them to deliver meaningful acts of service.</li>
                <li><strong>Provide supplies for patients and participants</strong> for therapeutic art events (colored pencils, markers, fabric for fashion events, etc).</li>
              </ul>
            </div>   
        </div>
      </div>
    </div>
  )
}
