// import { model } from "@medusajs/framework/utils";

// export const Account = model
//   .define("account", {
//     id: model
//       .id({
//         prefix: "acc",
//       })
//       .primaryKey(),
//     name: model.text().searchable(),
//     father_name: model.text().searchable().nullable(),
//     grand_father_name: model.text().searchable().nullable(),
//     full_name: model.text().searchable(),
//     email: model.text().unique(),
//     phone: model.text().searchable(),
//     avatar_url: model.text().nullable(),
//     birth_date: model.dateTime().nullable(),
//     country: model.text().searchable().nullable(),
//     timezone: model.text().searchable().nullable(),
//     language: model.text().searchable().nullable(),
//     metadata: model.json().nullable(),
//   })
//   .indexes([
//     {
//       on: ["full_name"],
//       where: "deleted_at IS NULL",
//     },
//     {
//       on: ["email"],
//       where: "deleted_at IS NULL",
//     },
//     {
//       on: ["phone"],
//       where: "deleted_at IS NULL",
//     },
//   ]);

// export default Account;
