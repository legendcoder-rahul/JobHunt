const { JobModel } = require("../models/job.model.js")

const postJob = async (req,res)=>{
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body   
        const userId = req.id

        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: 'All fields are required.',
                success: false
            })
        }

        // Parse requirements - split by comma and trim whitespace
        const requirementsArray = requirements.split(',').map(req => req.trim()).filter(req => req.length > 0)
        
        if(requirementsArray.length === 0) {
            return res.status(400).json({
                message: 'Please provide at least one responsibility (comma-separated)',
                success: false
            })
        }

        const job = await JobModel.create({
            title,
            description,
            requirements: requirementsArray,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        })

        return res.status(201).json({
            message: 'Job posted successfully.',
            success: true,
            job
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error posting job',
            success: false,
            error: error.message
        })
    }
}


const getAllJobs = async (req,res)=>{
    try {
        const keyword = req.query.keyword || ''
        let query = {}
        
        if(keyword) {
            query = {
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                    { location: { $regex: keyword, $options: 'i' } }
                ]
            }
        }
        
        const jobs = await JobModel.find(query).populate({
            path: 'company',
        }).sort({ createdAt: -1 })
        
        return res.status(200).json({
            message: 'Jobs retrieved successfully.',
            success: true,
            jobs
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        })
    }
}

const getJobById = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await JobModel.findById(jobId)
        if(!job){
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            })
        }
        return res.status(200).json({
            message: 'Job retrieved successfully.',
            success: true,
            job
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        })

    }
}


//admin
const getAdminJObs = async (req, res)=>{
    try{
        const adminId = req.id
        const jobs = await JobModel.find({created_by: adminId})
        if(!jobs){
            return res.status(404).json({
                message: 'No jobs found.',
                success: false
            })
        }
        return res.status(200).json({
            message: 'Jobs retrieved successfully.',
            success: true,
            jobs
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error fetching admin jobs',
            success: false
        })
    }
}

module.exports = { postJob, getAllJobs, getJobById, getAdminJObs }

