import { Readable } from 'stream'
import { AssemblyAI, RealtimeTranscript } from 'assemblyai'
import { SoxRecording } from '../sox.js'

const run = async () => {
  const client = new AssemblyAI({
    apiKey: 'e355af3b50be4f9d9b196680f4e3b241'
  })

  const SAMPLE_RATE = 16_000

  const transcriber = client.realtime.transcriber({
    sampleRate: SAMPLE_RATE
  })

  transcriber.on('open', ({ sessionId }) => {
    console.log(`Session opened with ID: ${sessionId}`)
  })

  transcriber.on('error', (error) => {
    console.error('Error:', error)
  })

  transcriber.on('close', (code, reason) =>
    console.log('Session closed:', code, reason)
  )

  transcriber.on('transcript', (transcript) => {
    if (!transcript.text) {
      return
    }

    if (transcript.message_type === 'PartialTranscript') {
      console.log('Partial:', transcript.text)
    } else {
      console.log('Final:', transcript.text)
    }
  })

  console.log('Connecting to real-time transcript service')
  await transcriber.connect()

  console.log('Starting recording')
  const recording = new SoxRecording({
    channels: 1,
    sampleRate: SAMPLE_RATE,
    audioType: 'wav' // Linear PCM
  })

  recording.stream().pipeTo(transcriber.stream())

  // Stop recording and close connection using Ctrl-C.
  process.on('SIGINT', async function () {
    console.log()
    console.log('Stopping recording')
    recording.stop()

    console.log('Closing real-time transcript connection')
    await transcriber.close()

    process.exit()
  })
}

//run()
