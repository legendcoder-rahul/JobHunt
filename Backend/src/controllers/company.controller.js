const { CompanyModel } = require('../models/company.model.js')

const registerCompany = async(req, res) => {
    try{
        const {companyName} = req.body
        if(!companyName) {
            return res.status(400).json({
                message: 'Company name is required',
                success: false
            })
        }
        let company = await CompanyModel.findOne({name: companyName})
        if(company){
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        }

        company = await CompanyModel.create({
            name: companyName,
            userId: req.id
        })

        return res.status(201).json({
            message: 'Company registered successfully.',
            company,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error registering company',
            success: false
        })
    }
}

const getCompany = async (req, res) =>{
    try {
        const userId = req.id//logged in user id
        const companies = await CompanyModel.find({userId})
        if(!companies){
          return res.status(404).json({
            message: 'Companies not found.',
            success: false
          })  
        }
        return res.status(200).json({
            companies,
            success: true
        })
    }catch(error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error fetching companies',
            success: false
        })
    }
}

//get company by id

const getCompanyById = async (req, res) => {
    try{
        const companyId = req.params.id
        const company = await CompanyModel.findById(companyId)
        if(!company) {
            return res.status(404).json({
                message: 'Company not found.',
                success: false
            })
        }

        return res.status(200).json({
            company,
            success: true
        })
    } catch(error){ 
        console.log(error)
        return res.status(500).json({
            message: 'Error fetching company',
            success: false
        })
    }
}

const updateCompany = async (req, res) => {
    try{
        const {name, description, website, location} = req.body
        const file = req.file

        const updateData = {name, description, website, location}
        const company = await CompanyModel.findByIdAndUpdate(req.params.id, updateData, {new: true})
        
        if(!company){
            return res.status(404).json({
                message: 'Company not found',
                success: false
            })
        }

        return res.status(200).json({
            message: 'Company information updated',
            company,
            success: true
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error updating company',
            success: false
        })
    }
}

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany }