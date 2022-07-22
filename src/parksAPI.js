const ParksAPI = {
    data:  function() {

        let data;
        let parks = fetch('https://developer.nps.gov/api/v1/parks?limit=500&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')
            .then(res => res.json())
            .then(res => data = res)
            .then(() => parks = data)
            // .then(() => console.log(data.data[0]))
            // .then(() => parks = data)
        return parks;

        return fetch('https://developer.nps.gov/api/v1/parks?limit=480&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')
                   .then(res => res.json())
                   .then(res => res)

        // let dat
        // fetch('https://developer.nps.gov/api/v1/parks?limit=500&api_key=P3sQ0KIWhYmCMsDJp5VDzLSAAOvDY0X7psUzGTMN')
        //     .then(res => res.json())
        //     .then(res => dat = res)
        
        // return dat;
    }
}

module.exports = ParksAPI;