import axios from 'axios'

export async function sendSms(phoneNumber: string, message: string) {
  try {
    const api = axios.create({
      baseURL: 'https://api-v2.thaibulksms.com/sms',
      headers: { 'X-Custom-Header': '' },
    })
    const data = {
      msisdn: phoneNumber,
      message,
      sender: 'T-Mobility',
      force: 'corporate',
    }
    const headers = {
      auth: {
        username: 'NiOK2bfc1Nb6FoZJ3R8ddwZSRUhkR7',
        password: '_wirEoOCct-EhYSBapA93qhHcw6WIE',
      },
    }
    await api.post('/', data, headers)
    return true
  } catch (e) {
    console.log(e.message)
    return false
  }
}

export default {
  send: sendSms,
}
