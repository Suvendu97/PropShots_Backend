const City = require("../models/city");
const State = require("../models/state");
const cityList = require("./CityData");
const stateList = require("./StateData");

module.exports.createState = async (req, res) => {
    try {
        await State.deleteMany({}).
        then(console.log("removed states!")).
        catch(err => console.log("can't remove states!"))
            
        State.find({}).then(async state => {
            if(state.length > 0) {
                res.json("States already created");
            }else{
                await stateList.forEach(stateData => {
                    State.create({
                        id : stateData.id,
                        name : stateData.name
                    }).then(state => {
                        console.log("states created")
                    }).catch(err => console.log(err))
                });
                res.json("States created");
            }
        }).catch(err => console.log(err));
    } catch (error) {
        console.log("Something went wrong ", error)
    }
}

module.exports.getState = (req, res) => {
    try {
        State.find({}).then(states => {
            res.json(states);
        }).catch(err => console.log(err));
    } catch (error) {
        console.log("Something went wrong ", error)
    }
}

module.exports.createCity = async (req, res) => {
    try {
        await City.deleteMany({}).
        then(console.log("removed Cities!")).
        catch(err => console.log("can't remove Cities!"))
        
        City.find({}).then(async city => {
            if(city.length > 0) {
                res.json("Cities already created");
            }else{
                await cityList.forEach(cityData => {
                    City.create({
                        name : cityData.name,
                        state_id : cityData.state_id
                    }).then().
                    catch(err => console.log(err))
                });
                res.json("cities created");
            }
        }).catch(err => console.log(err));
    } catch (error) {
        console.log("Something went wrong ", error)
    }
}

module.exports.getCityOfState = (req, res) => {
    try {
        City.find({state_id:req.query.id}).then(city => {
            res.json(city);
        }).catch(err => console.log(err));
    } catch (error) {
        console.log("Something went wrong ", error)
    }
}

module.exports.getCity = (req, res) => {
    try {
        City.find({}).then(city => {
            res.json(city);
        }).catch(err => console.log(err));
    } catch (error) {
        console.log("Something went wrong ", error)
    }
}