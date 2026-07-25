import { useEffect, useRef, useState } from 'react'
import { loadFaceModels, detectFaceDescriptor } from '../faceapi.js'
import './FaceCapture.css'

function FaceCapture({ onCapture, busy, statusMsg, statusType }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function start() {
      try {
        await loadFaceModels()
      } catch (err) {
        console.error('[FaceCapture] failed to load face-api models', err)
        if (!cancelled) setLocalError('Could not load the face recognition models. Check your connection and reload.')
        return
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setLocalError('This browser does not support camera access here. Make sure you are on http://localhost (not an IP address) and try Chrome/Edge/Opera up to date.')
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setReady(true)
      } catch (err) {
        console.error('[FaceCapture] failed to access camera', err)
        if (cancelled) return
        if (err.name === 'NotAllowedError') {
          setLocalError('Camera access was blocked. Allow camera for this site in your browser settings, then reload.')
        } else if (err.name === 'NotFoundError') {
          setLocalError('No camera was found on this device.')
        } else if (err.name === 'NotReadableError') {
          setLocalError('The camera is being used by another app. Close it and try again.')
        } else {
          setLocalError(`Could not access the camera (${err.name || err.message}).`)
        }
      }
    }

    start()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  async function handleCapture() {
    if (!ready || busy) return
    setLocalError('')
    setScanning(true)
    try {
      const descriptor = await detectFaceDescriptor(videoRef.current)
      if (!descriptor) {
        setLocalError('No face detected. Center your face in the frame and try again.')
        return
      }
      await onCapture(descriptor)
    } finally {
      setScanning(false)
    }
  }

  const working = busy || scanning

  return (
    <div className="face-capture">
      <div className={`face-frame${ready ? ' ready' : ''}${working ? ' scanning' : ''}`}>
        <video ref={videoRef} muted playsInline />
        {!ready && !localError && <div className="face-overlay">Loading camera…</div>}
      </div>

      {localError && <div className="face-msg error">{localError}</div>}
      {!localError && statusMsg && <div className={`face-msg ${statusType || ''}`}>{statusMsg}</div>}

      <button className="btn-verify" type="button" onClick={handleCapture} disabled={!ready || working}>
        {working ? 'Scanning…' : 'Capture Face ID'}
      </button>
    </div>
  )
}

export default FaceCapture
