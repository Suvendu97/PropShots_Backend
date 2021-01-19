const USER = require('../models/user');
const jwt = require('jsonwebtoken');
const IGNOREDLIST = require('../models/ignoredList');

module.exports.add = async function (req, res) {
    try {
        let ignored = await IGNOREDLIST.findOne({ "prop.id": req.params.id, "user.id" :req.user._id});
        if(!ignored) {
            ignored = new IGNOREDLIST({
                user: {
                    id: req.user._id,
                  },
                  prop: {
                    id: req.params.id,
                  },
                });
                ignored.save();
            console.log("Ignored Successfully");
            return res.json(200, {
                message: 'Property added to Ignored List'
            })
        } else {
            console.log('Property already Ignored')
            return res.json(409, {
                message: 'Property already Ignored',
                
            })
        }
    } catch (err) {
        console.log('Error', err);
        return res.json(500, {
            message: 'Internal Server Error'
        })
    }
}


module.exports.remove = async function (req, res) {
    try{
        IGNOREDLIST.DeleteOne({prop : req.params.id, user: req.user._id});
        console.log("Deleted from ignored List");
            return res.json(200, {
                message: 'Property Deleted from ignored List'
            })
    } catch(err) {
        console.log('Error', err);
        return res.json(500, {
            message: 'Property isnot in ignored List'
        })
    }
    
z
}


module.exports.IgnoredList =  async function (req, res) {
    try {
    let ignoredList = await IGNOREDLIST.find({user: req.user});
    if(ignoredList) {
        return res.json(200, {
            message: 'Ingnored List:',
            List: ignoredList
        });
    } else {
        return res.json(500, { 
            message: 'List not found!'
        })
    }

    } catch(err) {
        console.log('Error', err);
        return res.json(500, {
            message: 'Property isnot in ignored List'
        })
    }
}