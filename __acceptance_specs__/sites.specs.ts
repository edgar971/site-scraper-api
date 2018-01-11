import * as chai from 'chai'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Site } from '../common/interfaces';

chai.should()
const apiUrl = 'http://localhost:8888/v2'

context('#sitesApi specs', () => {
  describe('when calling the API endpoint to list the sites successfully', () => {
    const url = `${apiUrl}/sites`
    let response: AxiosResponse
    let sites: Array<Site>

    before(async () => {
      response = await axios.get(url)
      sites = response.data.data
    })

    it('should return 200', () => response.status.should.equal(200))
    it('should be an array of sites', () => sites.should.be.an('array'))
  })
})
