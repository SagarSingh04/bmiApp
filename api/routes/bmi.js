const express = require('express');
const bmiCategoryJson = require('../json/bmiCategory.json');
const healthRiskJson = require('../json/healthRisk.json');
const router = express.Router();

router.post('/getBMI', async(req, res, next) => {
    try{
        let reqBody = req.body.jsonArray;
        //Calculating BMI and adding it to the result
        let bmiResult = await calculateBMI(reqBody);
        // console.log(bmiResult);

        //Calculating the category and adding it to the result
        let categoryResult = await calculateBmiCategory(bmiResult);
        // console.log(categoryResult);

        //Calculating the health risk and adding it to the result
        let healthRiskResult = await calculateHealthRisk(categoryResult);
        // console.log(healthRiskResult);

        res.status(200).json({
            result: healthRiskResult
        })
    }
    catch(error){
        console.log("Error occured");
        console.log(error);
        res.status(500).json({
            message: "Error",
            error: error
        })
    }
});

//Function to calculate BMI
async function calculateBMI(jsonArray) {
    return new Promise((resolve, reject) => {
        try{
            let result = jsonArray.map((json) => {
                let heightCm = json.HeightCm;
                let weightKg = json.WeightKg;
                let heightMtr = heightCm/100;
    
                //Applying BMI formula
                let bmi = weightKg/(heightMtr * heightMtr);
                console.log(bmi.toFixed(2));
                json['BMI'] = bmi.toFixed(2);
                return json;
            });
            resolve(result);
        }
        catch(error) {
            console.log(error);
            reject(error);
        }
        
    });
}

//Function to calculate BMI Category
async function calculateBmiCategory(jsonArray){
    return new Promise((reslove, reject) => {
        try{
            let result = jsonArray.map((json) => {
                let bmiCategory = "";
                for(let key in bmiCategoryJson)
                {
                    let lowerRange = bmiCategoryJson[key]['lower'];
                    let upperRange = bmiCategoryJson[key]['upper'];

                    //Checking the range and calculating the category
                    if(json.BMI > lowerRange && json.BMI < upperRange){
                        bmiCategory = key;
                    }
                }

                json['BMICategory'] = bmiCategory;
                console.log(bmiCategory);
                return json;
            });
            reslove(result)
        }
        catch(error){
            console.log(error);
            reject(error);
        }
    });
}

//Function to calculate Health Risk
async function calculateHealthRisk(jsonArray){
    return new Promise((reslove, reject) => {
        try{
            let result = jsonArray.map((json) => {
                let healthRisk = "";

                //Mapping the health risk with the category
                for(let key in healthRiskJson)
                {
                    if(key == json.BMICategory){
                        healthRisk = healthRiskJson[key];
                    }
                }

                console.log(healthRisk);
                json['HealthRisk'] = healthRisk;
                return json;
            });
            reslove(result)
        }
        catch(error){
            console.log(error);
            reject(error);
        }
    });
}

module.exports = router;