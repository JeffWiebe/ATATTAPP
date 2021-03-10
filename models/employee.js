

const
        mongoose                            =   require('mongoose'),
        employeeSchema                      =   new mongoose.Schema ({
            name: {
                type: String,
                required: true,
            },
            location: {
                type: String,
                required: true,
                default: 'Abbotsford'
            },
            shift: {
                type: String,
                required: true,
                default: 'Day Shift'
            },
        });

module.exports                              =   mongoose.model('Employee', employeeSchema);