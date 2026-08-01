import { useEffect } from 'react'
import '../styles/supportus.scss'

const FUNRAISE_ORG_ID = '0f310c11-8882-45d5-b412-4b4035fa0272'
const FUNRAISE_FORM_ID = 51238
const FUNRAISE_CONTAINER_ID = 'fr-placed-form-container-51238'

export default function SupportUs() {
  useEffect(() => {
    const awareScript = document.createElement('script')
    awareScript.text = `(function(f,u,n,r,a,i,s,e){var data={window:window,document:document,tag:"script",data:"funraise",orgId:f,uri:u,common:n,client:r,script:a};var scripts;var funraiseScript;data.window[data.data]=data.window[data.data]||[];if(data.window[data.data].scriptIsLoading||data.window[data.data].scriptIsLoaded)return;data.window[data.data].loading=true;data.window[data.data].push("init",data);scripts=data.document.getElementsByTagName(data.tag)[0];funraiseScript=data.document.createElement(data.tag);funraiseScript.async=true;funraiseScript.src=data.uri+data.common+data.script+"?orgId="+data.orgId;scripts.parentNode.insertBefore(funraiseScript,scripts)})('${FUNRAISE_ORG_ID}','https://assets.funraise.io','/widget/common/2.0','/widget/client','/inject-form.js');`

    const configScript = document.createElement('script')
    configScript.text = `window.funraise.push('create', { form: ${FUNRAISE_FORM_ID} }, { selector: '#${FUNRAISE_CONTAINER_ID}', type: 'grow_contained' });`

    document.head.appendChild(awareScript)
    document.head.appendChild(configScript)

    return () => {
      awareScript.remove()
      configScript.remove()
    }
  }, [])

  return (
    <div>
      <div className="mobile-spacer yellow" />
      <div className="section-medium dark-blue">
        <h1>SUPPORT US</h1>
        <p>Find a chapter, join a team, or help us grow.</p>
      </div>

      <div id="donate" className="section-medium yellow">
        <h1>DONATE</h1>
        <p>Help us serve more communities by making a donation to Solis and Luna Arts.</p>
        <div id={FUNRAISE_CONTAINER_ID} style={{ minHeight: '816px' }} />
      </div>
    </div>
  )
}
