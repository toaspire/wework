Experts = new Mongo.Collection("experts");

Experts.attachSchema(
	new SimpleSchema({
        userId: {
            type: String,
            autoValue: function() {
				if (this.isInsert) {
					return Meteor.userId();
				} else if (this.isUpsert) {
					return {$setOnInsert: Meteor.userId()};
				} else {
					this.unset();
				}
			},
			denyUpdate: true
        },
        userName: {
            type: String,
            label: "User Name",
            autoValue: function() {
                if (this.isInsert) {
                    return getUserName(Meteor.user());
                } else if (this.isUpsert) {
                    return {$setOnInsert: getUserName(Meteor.user())};
                } else {
                    this.unset();
                }
            }
        },
        name: {
            type: String,
            label: "Name",
            max: 128
        },
        type: {
            type: String,
            label: "Individual or Company",
            allowedValues: ["Individual", "Company"]
        },
        title: {
            type: String,
            label: "Title",
            max: 128
        },
        location: {
            type: String,
            label: "Location",
            max: 256
        },
        description: {
            type: String,
            label: "Description",
            max: 4096
        },
        availableForHire: {
            type: Boolean,
            label: "Currently Available For Hire",
            defaultValue:false
        },
        interestedIn: {
            type: [String],
            label: "Interested In",
            allowedValues:["Full Time", "Hourly Contract", "Term Contract", "Mentoring", "Open Source", "Volunteer"],
            optional:true
        },
        contact: {
            type: String,
            label: "Contact Info",
            max: 1024,
			optional: true
        },
        url: {
            type: String,
            label: "Personal URL",
            max: 1024,
            optional: true,
            regEx:SimpleSchema.RegEx.Url
        },
        resumeUrl: {
            type: String,
            label: "Resume URL",
            max: 1024,
			optional: true,
            regEx:SimpleSchema.RegEx.Url
        },
        githubUrl: {
            type: String,
            label: "GitHub URL",
            max: 1024,
			optional: true,
            regEx:SimpleSchema.RegEx.Url
        },
        linkedinUrl: {
            type: String,
            label: "LinkedIn URL",
            max: 1024,
			optional: true,
            regEx:SimpleSchema.RegEx.Url
        },
        stackoverflowUrl: {
            type: String,
            label: "Stackoverflow URL",
            max: 1024,
			optional: true,
            regEx:SimpleSchema.RegEx.Url
        },
        randomSorter: {
            type: Number,
            defaultValue: Math.floor(Math.random()*10000)
        },
        // Force value to be current date (on server) upon insert
		// and prevent updates thereafter.
		createdAt: {
			type: Date,
			autoValue: function() {
				if (this.isInsert) {
					return new Date();
				} else if (this.isUpsert) {
					return {$setOnInsert: new Date()};
				} else {
					this.unset();
				}
			},
			denyUpdate: true
		},
		// Force value to be current date (on server) upon update
		// and don't allow it to be set upon insert.
		updatedAt: {
			type: Date,
			autoValue: function() {
				if (this.isUpdate) {
					return new Date();
				}
			},
			denyInsert: true,
			optional: true
		},
		// Automatically set HTML content based on markdown content
		// whenever the markdown content is set.
		htmlDescription: {
			type: String,
			optional: true,
			autoValue: function(doc) {
				var markdownContent = this.field("description");
				if (Meteor.isServer && markdownContent.isSet) {
					return marked(markdownContent.value);
				}
			}
		}
    })
);

Experts.helpers({
  displayName: function() {
    return this.name || this.userName;
  }
});

Experts.allow({
  insert: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return userId && doc && userId === doc.userId;
  },
  remove: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  fetch: ['userId']
});
