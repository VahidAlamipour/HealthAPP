import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import homeReducer from "./homeReducer";
import forgotPasswordReducer from "./forgotPasswordReducer";
import forgotPasswordResetReducer from "./forgotPasswordResetReducer";
import resetPasswordReducer from "./resetPasswordReducer";
import signUpReducer from "./signUpReducer";
import profileReducer from "./profileReducer";
import profileUpdateReducer from "./profileUpdateReducer";
import changePasswordReducer from "./changePasswordReducer";
import mainViewReducer from "./mainViewReducer";
import stockManagementReducer from "./stockManagementReducer";
import symptomReducer from "./symptomReducer";
import editSymptomReducer from "./editSymptomReducer";
import graphManagementReducer from "./graphManagementReducer";
import subUserCreateReducer from "./subUserCreateReducer";
import recipeManagementReducer from "./recipeManagementReducer";
import recipeReducer from "./recipeReducer";
import productReducer from "./productReducer";
import mealPlannerReducer from "./mealPlannerReducer";
import mealPlanSummaryReducer from "./mealPlanSummaryReducer";
import forumReducer from "./forumReducer";

const reducers = combineReducers({
  form: formReducer,
  home: homeReducer,
  forgotPassword: forgotPasswordReducer,
  forgotPasswordReset: forgotPasswordResetReducer,
  resetPassword: resetPasswordReducer,
  signUp: signUpReducer,
  profile: profileReducer,
  profileUpdate: profileUpdateReducer,
  changePassword: changePasswordReducer,
  subUserCreate: subUserCreateReducer,
  recipeManagement: recipeManagementReducer,
  stockManagement: stockManagementReducer,
  symptom: symptomReducer,
  editSymptom: editSymptomReducer,
  graphManagement: graphManagementReducer,
  mainView: mainViewReducer,
  recipe: recipeReducer,
  product: productReducer,
  mealPlanner: mealPlannerReducer,
  mealPlanSummary: mealPlanSummaryReducer,
  forumReducer
});

export default reducers;
