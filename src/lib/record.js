export const emptyCreator = {
  affiliations: [
    {
      name: '',
    },
  ],
  given_name: '',
  family_name: '',
  name: '',
  type: 'personal',
};

export const emptyContributor = { ...emptyCreator, role: '' };

export const emptyAdditionalTitle = {
  lang: '',
  title: '',
  type: 'alternativetitle',
};

export const emptyIdentifier = {
  scheme: '',
  identifier: '',
};
