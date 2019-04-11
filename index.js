const arr = [
  [0, "name", "Atome Credit"],
  [0, "welcome", "Welcome"],
  [1, "nav_obj_credit", "Credit"],
  [1, "nav_obj_repayment", "Repayment"],
  [1, "nav_obj_me", "Me"],
  [1, "credit_obj_AmountReceived", "Amount Received"],
  [1, "credit_obj_TotalRepayment", "Total Repayment"],
  [1, "credit_obj_agreement", "agreement"],
  [1, "credit_obj_loanAgree1", "I agreed to the"],
  [1, "credit_obj_loanAgree2", "loan agreement"],
  [1, "credit_obj_LoanAmount", "Loan Amount"],
  [1, "credit_obj_LoanPlan", "Loan Plan"],
  [2, "aaa_obj_Loan", "Loan"],
  [2, "aaa_obj_days", "days"],
  [1, "help_obj_title", "Help center"],
  [1, "help_obj_mail", "Service Email"],
  [3, "0_obj_name_list", "Receive money"],
  [5, "0_obj_question_contents", "111"],
  [6, "answers_arr_0_answers", "2222"],
  [3, "1_obj_name_answers", "Loan application"],
  [5, "0_obj_question_contents", "Who can apply?"],
  [6, "answers_arr_0_answers", "1. Between 21-60 years old"],
  [6, "answers_arr_1_answers", "2. Currently employed or with a steady income"],
  [5, "1_obj_question_answers", "What are the requirements?"],
  [6, "answers_arr_0_answers", "1. Personal information and Aadhaar"],
  [6, "answers_arr_1_answers", "2. Your bank account details for disbursement"],
  [5, "2_obj_question_answers", "How long is the loan process?"],
  [6, "answers_arr_0_answers", "Just ensure that you have filled up all the inform…pload clear photos of all the required documents."],
  [6, "answers_arr_1_answers", "Expect the money transferred to your bank account within 1 WORKING DAY!"],
  [3, "2_obj_name_answers", "Re-loan application"],
  [5, "0_obj_question_contents", "How long will it take to get a re-loan?"],
  [6, "answers_arr_0_answers", "As you have already taken a loan with us and provi…will make it even faster to grant you a new loan."],
  [3, "3_obj_name_answers", "Loan repayment"],
  [5, "0_obj_question_contents", "When is my loan due?"],
  [6, "answers_arr_0_answers", "The repayment due date will be indicated in REPAYM…ou a text message if it's close to your due date."],
  [5, "1_obj_question_answers", "How can i repay my loan?"],
  [6, "answers_arr_0_answers", "You can repay your loan by heading over to the Rep… e-mail on cs@atome.in and we shall look into it."],
  [5, "2_obj_question_answers", "What if I made late repayments?"],
  [6, "answers_arr_0_answers", "We advise paying on or before the due date. For la…e liable to pay all the fees charged accordingly."],
  [5, "3_obj_question_answers", "Can I repay earlier than my due date?"],
  [6, "answers_arr_0_answers", "Yes. The earlier you repay, the faster you can get a re-loan."],
]
const obj = {};
let initLevel = 0;
let currentName = '';
let flag = true
function formatData(arr, myObj) {
  for (let i = 0; i < arr.length; i++) {
    const items = arr[i];
    const value = items[2];
    const fields = items[1].split('_')
    const name = fields[0]
    const type = fields[1]
    // const key = fields[2]
    // const type = fields[3]
    // const type = fields[4]
    // console.log('type', type);
    if(!type) {
      myObj[fields[0]] = value
      continue
    }
    debugger
    if(type === 'obj') {
      myObj[fields[0]] = {}
      if(flag) {
        currentName = fields[0]
        flag = false
      }
      if(currentName === fields[0]) {
        myObj[fields[0]][fields[2]] = value
      }
    }
    if(type === 'arr') {
      myObj[fields[0]] = []
      // myObj[fields[0]][fields[2]].
    }
    // const currentLevel = items[0];
    // console.log(value);

    // if(initLevel === currentLevel) {
    //   // console.log(value);

    // }
    // if(initLevel + 1 === currentLevel) {
    //   initLevel = currentLevel
    //   // console.log(value);
    // }
  }
}
formatData(arr, obj)
console.log(obj, '===');

// for (let i = 0; i < arr.length; i++) {
//   const items = arr[i];
//   const level = items[0];
//   const value = items[2];
//   const fields = items[1].split('_')
//   if (currentLevel === +level) {
//     obj[fields[0]] = value
//   } else if (currentLevel + 1 === +level) {
//     currentObjName = fields[0]
//     if(flag) {
//       obj[fields[0]] = {}
//       obj[fields[0]][fields[2]] = value
//       flag = false
//     } else {
//       obj[fields[0]][fields[2]] = value
//     }
//   }
// }


for (let i = 0; i < 6; i++) {
  const element = 6[i];

}
