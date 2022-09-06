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
        username: '2AXMZxD2dG8sehgliwUkfiqEk2kd2_',
        password: '3mn5bqSHGfB_9rA-ucmG7iZJPmMn0-',
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
