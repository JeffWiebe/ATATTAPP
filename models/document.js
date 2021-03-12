

const
        mongoose                            =   require('mongoose'),
        // allianceTrussNetworkPathFragment    =   'H:/Alliance_Truss/Employees/',      // Commented out initially, as build is not ready for the dynamic path process.
        // documentThumbsBasePath              =   'uploads/documents/thumbnails',       // Commented out initially, as build is not ready for this.
        coverImageBasePath                  =   'uploads/documents/covers',
        
        
        
        
        
        documentSchema                      =   new mongoose.Schema ({
            employee: {
                type: mongoose.Schema.Types.ObjectId,       // The name of the employee via the id string of the employee
                required: true,
                ref: "Employee"
            },
            documentTitle: {        // The title we are giving this doument
                type: String,
                required: true,
            },
            documentCategory: {     // eg. Boot Allowance, Discipline, Doctor's Note, New Hire Package, Resume, etc.
                type: String,
                required: true,
                default:    'General'
            },
            documentDescription: {      // A description of the document's contents, and/or perhaps the purpose for saving the document.
                type: String,
            },
            documentTags: {         // Keywords (strings) associated with the document, eg. Mark's Work Wearhouse, Sick, Excuse, Relative's Death, etc.
                type: String,
            },
            documentPages: {        // How many pages the document consists of
                type: Number,
                required: true,
            },
            documentScan: {     //This will start out just as a name, at this point in the build; later it may be a 'cover image'/thumbnail
                type: String,
            },
            documentKeyDate: {      // A date that is significant to the document. eg. the date the boot allowance was given, if the document is a boot allowance receipt.
                type: Date,
            },
            documentKeyFunds: {     // A sum of money that is significant to the document. eg. the sum of money of the boot allowance.
                type: Number,
            },
            documentCreatedDate: {      // The date the document was created in this system
                type: Date,
                required: true,
                default: Date.now
            },
            documentCreatedBy: {      // The date the document was created in this system
                type: String,
                required: true,
            },
            documentAllianceTrussNetworkPath: {     // The network path on our servers where the document is stored.
                type: String,
                required: true,
                default: "H:/Alliance_Truss/Employees/..."
            },
            coverImageName: {     // During one stage of the build, I'm using this to test.
                type: String,
            },
        });

module.exports                              =   mongoose.model('Document', documentSchema);
module.exports.coverImageBasePath           =   coverImageBasePath;