const mongoose = require("mongoose");

// interface materialsType {
//   materialId:String;
//   metalId?:String;
//   weight:Number;
//   unit:"gm"|"tola"|"carat"|"cent";
//   makingCharge?:Number;
//   makingUnit?:"gm"|"tola"|"percent"
// }
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    materials:[{
    materialid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
    },
    metalid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Metal',
    },
    weight: Number,
    makingCharge: Number,
    makingUnit:{
      type:String,
      enum:["gm","tola","percent"]
    },
    unit:{type:String,
      enum:["gm","tola","carat","cent"]
    }
  }]
    // slug: {
    //   type: String,
    //   required: true,
    // },
    // description: {
    //   type: String,
    //   required: true,
    // },
    // offers:{
    //   type:[String],
    // },
    // categoryId: {
    //   type: mongoose.ObjectId,
    //   ref: "Category",
    //   required: true,
    // },
    // giftId: {
    //   type: mongoose.ObjectId,
    //   ref: "Gift",
    //   required: true,
    // },
    // preferenceId: {
    //   type: mongoose.ObjectId,
    //   ref: "Preference",
    //   required: true,
    // },
    // image: {
    //   type: String,
    // },
    // images:{
    //   type:[String]
    // },
    // status: {
    //   type: Boolean,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);