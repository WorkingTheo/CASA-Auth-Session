import { field, validators as r } from '@dwp/govuk-casa';

export default [
  field('name').validators([
    r.required.make({
      errorMsg: 'name:errorMessage',
    }),
    r.strlen.make({
      max: 100,
      errorMsgMax: 'name:length',
    }),
  ]),
];
