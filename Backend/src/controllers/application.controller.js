const {applicationModel} = require("../models/application.model.js")
const {JobModel} = require("../models/job.model.js")

const applyJob = async(req, res) =>{
    try {
        const userId = req.id
        const jobId = req.params.id
        if(!jobId){
            return res.status(400).json({
                message: 'Job id is requied',
                success: false
            })}

            const existingApplication = await applicationModel.findOne({ job: jobId, applicant: userId })

            if(existingApplication){
                return res.status(400).json({
                    message: 'You have already applied for this job',
                    success: false
                })
            }
        

        //check if the jobs exists
        const job = await JobModel.findById(jobId)
        if(!job){
            return res.status(404).json({
                message: 'Job not found',
                success: false
            })
        }

        //create a new application

        const newApplication = await applicationModel.create({
            job: jobId,
            applicant: userId
        })

        job.applications.push(newApplication._id)
        await job.save()
        return res.status(200).json({
            message: 'Application submitted successfully',
            success: true,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error applying for job',
            success: false
        })
    }
}

const getAppliedJobs = async (req, res)=>{
    try{
        const userId = req.id
        const application = await applicationModel.find({applicant: userId}).sort({createdAt: -1}).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: {sort: {createdAt: -1}}
            }
        })

        if(!application){
            return res.status(404).json({
                message: 'No application found',
                success: false
            })
        }
        return res.status(200).json({
            application,
            success: true
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: 'Error fetching applied jobs',
            success: false
        })
    }
}
//how many user apply
const getApplicants = async (req, res)=>{
    try{
        const jobId = req.params.id
        const job = await JobModel.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
            }
        })
        if(!job){
            return res.status(404).json({
                message: 'Job not found',
                success: false
            })
        }

        return res.status(200).json({
            job,
            success: true
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: 'Error fetching applicants',
            success: false
        })
    }
}


const updateStatus = async (req, res)=>{
    try{
        const {status} = req.body
        const applicationId = req.params.id
        
        if(!status){
            return res.status(400).json({
                message: 'Status is required',
                success: false
            })
        }

        // find the application by id
        const application = await applicationModel.findById(applicationId)
        if(!application){
            return res.status(404).json({
                message: 'Application not found',
                success: false
            })
        }

        // Normalize the status to lowercase
        const normalizedStatus = status.toLowerCase().trim()
        
        // Validate status value
        const validStatuses = ['pending', 'accepted', 'rejected']
        if (!validStatuses.includes(normalizedStatus)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
                success: false
            })
        }

        // Update the status of the application
        application.status = normalizedStatus
        await application.save({ validateBeforeSave: true })

        return res.status(200).json({
            message: `Status updated to ${normalizedStatus} successfully`,
            success: true,
            application
        })
    }catch(error){
        console.error('Status update error:', error)
        return res.status(500).json({
            message: 'Error updating status',
            success: false,
            error: error.message
        })
    }
}

module.exports = { applyJob, getAppliedJobs, getApplicants, updateStatus }