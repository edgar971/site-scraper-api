import * as chai from 'chai'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

chai.should()

const apiUrl = "http://localhost:8888/v2"

context('#sitesApi specs', () => {
  describe('when calling the API endpoint to list the sites successfully', () => {
    const url = `${apiUrl}/sites`
    let response: AxiosResponse

    before(async () => {
      response = await axios.get(url)
    })

    it('should return 200', () => response.status.should.equal(200))
  })
})
