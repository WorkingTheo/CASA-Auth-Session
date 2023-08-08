import { field, validators as r } from '@dwp/govuk-casa';

export default [
  field('feelings').validators([
    r.required.make({
      errorMsg: 'feelings:errorMessage',
    }),
    r.strlen.make({
      max: 100,
      errorMsgMax: 'feelings:length',
    }),
  ]),
];
