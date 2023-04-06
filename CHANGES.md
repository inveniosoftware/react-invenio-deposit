# Changes

Version 2.6.0 (released 2023-03-04)

- communities: customizable selection modal api endpoints

Version 2.5.0 (released 2023-03-29)

- communities: selection modal external state management
- communities: compact item styling

Version 2.4.0 (released 2023-03-24)

- community: show/hide community header based on community resolution
- components: updated custom fields components

Version 2.3.1 (released 2023-03-21)

- fix overridable id wrapper rendering of FileUploaderToolbar

Version 2.3.0 (released 2023-03-20)

- review: update button labels
- community header: refactor community selection modal components
- file uploader: add overridable ids
- file uploader and access field: configurable record access display
- keywords: update field label

Version 2.2.0 (released 2023-03-13)

- rename ui permissions for direct publish action

Version 2.1.2 (released 2023-03-09)

- review: update redirect link

Version 2.1.1 (released 2023-03-03)

- file uploader toolbar: fix property name

Version 2.1.0 (released 2023-03-03)

- fields: add custom widgets: journal, meeting, imprint

Version 2.0.0 (released 2023-02-09)

- Add direct publish workflow for submitting to communities

Version 1.2.0 (released 2023-01-20)

- Always send a `pids` key to the backend. That change is needed as the backend behavior
  changed and now it always falls back to the previous saved pids instead of setting an
  empty dict when the key is absent (https://github.com/inveniosoftware/invenio-rdm-records/pull/1139).

Version 1.1.0 (released 2022-11-29)

- add overridable id to the deposit form components
- add required options to DateField

Version 1.0.4 (released 2022-11-25)

- add overridable to metadata-only button and metadata access

Version 1.0.3 (released 2022-11-18)

- `humanReadableBytes` is now returning a string instead of jsx
- normalize ck editor config for additional descriptions field
- centralize axios import

Version 1.0.2 (released 2022-11-10)

- configurable axios api request headers

Version 1.0.1 (released 2022-10-24)

- update missing peer dependency

Version 1.0.0 (released 2022-10-24)

- upgrade to node 18
- align yup package version
- update eslint-config-invenio

Version 0.20.5 (released 2022-10-07)

- components: fix license close modal handler

Version 0.20.4 (released 2022-10-03)

- Adds prop to Publish or Submit button to show extra html/text coming from deposit
  config.

Version 0.20.1 (released 2022-08-30)

- Adds support for custom fields

Version 0.20.0 (released 2022-08-19)

- Bump release for RDM v10

Version 0.19.15 (released 2022-07-08)

- fix payload sent for restricted community

Version 0.19.14 (released 2022-07-05)

- utils: exports function humanReadableBytes to be used outside react-invenio-deposit.
- creatibutors: fixed dropdown off-screen rendering

Version 0.19.13 (released 2022-07-01)

- fix community header margins on mobile view
- add vertical spacing to button in funding field
- add labels and remove custom css on file table
- add community visitibility labels

Version 0.19.12 (released 2022-06-29)

- fix uploaded filename encoding comparison

Version 0.19.11 (released 2022-06-22)

- fix non-validation error propagation
- styling fixes
- disable public restriction button for restricted community's record
- hide files restrictions on metadata-only option

Version 0.19.10 (released 2022-06-08)

- add translations
- ResourceTypeField: disable select on blur
- fix alignment issues in the form
- fix translation unescape in submit review modal

Version 0.19.9 (released 2022-05-19)

- made trigger button customizable in community selectio modal
- made improvements in funder field
- access: automatically switch record to restricted if a restricted community selected

Version 0.19.8 (released 2022-05-12)

- show "Remove" button in community selection modal whenever the user can
  select a community only
- Fix broken preview when user is previewing a draft that has not yet been created
- Fix upload of files

Version 0.19.7 (released 2022-05-06)

- expand draft/record endpoint after action
- resolve community metadata to display logo/title

Version 0.19.6 (released 2022-05-06)

- fixed type for community selection
- fixed community workflow for slug changes
- refactored warning text on publish

Version 0.19.5 (released 2022-05-06)

- add new Funding field
- fix community image loading
- add option to customize warning text in upload area
- add configurable modal text in PublishButton

Version 0.19.4 (released 2022-05-03)

- improve form responsiveness and layout
- added an option to change the display of the file size
- added GND and ROR icons

Version 0.19.3 (released 2022-04-26)

- fixed License header class name
- publish button: change submit text to be consistent in button and modal
- align content and change button styling
- change submit review button text

Version 0.19.2 (released 2022-04-07)

- add a new cmp to display the upload status
- refactor how the status of the upload is computed

Version 0.19.1 (released 2022-03-31)

- upgrade react-searchkit dependency to v2.0.0 because of the
  wrong version v1.0.0

Version 0.19.0 (released 2022-03-31)

- upgrade react-searchkit dependency

Version 0.18.3 (released 2022-03-25)

- forms: refactor styling classes
- remove bottom margin from the form feedback

Version 0.18.2 (released 2022-03-18)

- add submit review confirmation modal
- forms: refactor buttons style

Version 0.18.1 (released 2022-03-14)

- add review request workflow

Version 0.17.11 (released 2022-03-03)

- fix arrow navigation issues for names autocomplete search field
- remove default value for given name in creatibutors form

Version 0.17.10 (released 2022-03-02)

- add more options for creatibutors names autocomplete behavior

Version 0.17.9 (released 2022-03-02)

- add flag for toggling creatibutors names autocomplete

Version 0.17.8 (released 2022-03-01)

- change URL redirection after discarding a draft

Version 0.17.7 (released 2022-02-23)

- add temporal solution for non-resolved communities

Version 0.17.6 (released 2022-02-21)

- upgrades docs dependencies
- stores community prop in redux
- adds community header
- auto-complete prefill from names in creatibutors modal

Version 0.17.5 (released 2022-02-11)

- upgrades semantic-ui-react
- relax dependencies requirements patch versions

Version 0.15.8 (released 2021-07-20)

- improve deposit form error display

Version 0.15.6 (released 2021-07-14)

- improvements to subjects vocabulary integration
- fix subjects label bug

Version 0.15.5 (released 2021-07-09)

- subjects vocabulary integration

Version 0.15.4 (released 2021-07-09)

- affiliations vocabulary integration

Version 0.15.3 (released 2021-07-06)

- subjects is now a vocabulary field
- some translation support

Version 0.15.2 (released 2021-07-01)

- type and language vocabularies

Version 0.14.0 (released 2021-05-19)

- resource_type is now a vocabulary field (i.e. of the shape `{id: <id>}`),
  so changes are made to accomodate this
- Mark May release

Version 0.13.5 (released 2021-04-16)

- Pass files.enabled in the draft API payload
- Disable Publish button if errors
- Use backend error message to indicate missing files

Version 0.13.4 (released 2021-04-13)

Version 0.13.3 (released 2021-04-07)

Version 0.13.2 (released 2021-03-31)

Version 0.13.1 (released 2021-03-26)

Version 0.12.2 (released 2021-03-26)

Version 0.12.1 (released 2021-03-23)

- New version button
- Creatibutors: focus on family name/name when modal opens
- Change styling of md5 checksum text

Version 0.11.10 (released 2021-02-26)

- clearable role on creators only

Version 0.11.6 (released 2021-02-25)

- access: adds icon and update placeholder

Version 0.11.5 (released 2021-02-24)

- License: adds url validation for custom license link
- License: show readmore when no description

Version 0.11.4 (released 2021-02-23)

- Remove hardcoded owned_by user value from the serializer class

Version 0.11.1 (released 2021-02-10)

- UX fixes into CreatibutorsField
- LicenseField
  - UX fixes
  - Add ordering of licenses
- Global UX fixes towards a consistent deposit UI

Version 0.11.0 (released 2021-02-03)

- Add helptext for PublicationDate

Version 0.10.9 (released 2021-01-29)

- Fix bug in license results.

Version 0.10.8 (released 2021-01-29)

- Change license modal filter values

Version 0.10.7 (released 2021-01-29)

- Restyles Delete button confirm dialog's buttons

Version 0.10.6 (released 2021-01-29)

- Various UX fixes
- Exposes serializeLicenses prop for LicenseFIeld to serialize vocab response

Version 0.10.5 (released 2021-01-28)

- Adds ComingSoon component
- Refactors Creatibutor component

Version 0.10.4 (released 2021-01-26)

- Fills out full row in DataField
- Renames RelatedIdentifiers to RelatedWorks

Version 0.10.3 (released 2021-01-25)

- Hide file uploader warning when clicking on "Metadata only" checkbox

Version 0.10.2 (released 2021-01-25)

- Bump react invenio forms version
- Use onClick handler on array delete buttons

Version 0.10.1 (released 2021-01-22)

- Add DepositFormTitle
- LicenseField
  - Split add dropdown to separate buttons
  - Fix issue with space keystroke
  - Modal's content is scrollable now
- Resource type/subtype component is merged in one
- FileUploader
  - Fix metadata only checkbox bug
  - Centers "Pending" label
  - Upload section is hidden when "Metadata only" record
  - Use Message component for uploads note

Version 0.10.0 (released 2021-01-18)

- Add Delete button

Version 0.9.9 (released 2021-01-08)

- Disable Publish button unless deposit was successfully saved

Version 0.9.8 (released 2021-01-07)

- Add support for partial save
- Add form feedback message

Version 0.9.7 (released 2021-01-07)

Version 0.9.6 (released 2020-12-11)

Version 0.9.5 (released 2020-12-11)

Version 0.9.4 (released 2020-12-11)

Version 0.9.3 (released 2020-12-10)

Version 0.9.2 (released 2020-12-09)

Version 0.9.1 (released 2020-12-07)

Version 0.8.8 (released 2020-11-27)

- Fix metadata only checkbox when it was clicked without a draft created

Version 0.8.7 (released 2020-11-27)

- Disable publish if files are not uploaded or record marked as metadata only.

Version 0.8.6 (released 2020-11-27)

- Expose `isDraftRecord` to the FileUploader component

Version 0.8.5 (released 2020-11-26)

- Set default preview to the backend
- Enable/disable files

Version 0.8.4 (released 2020-11-25)

- Show 1st/last name if person, name if org in Creators and Contributors field.

Version 0.8.3 (released 2020-11-25)

- Filename is a link to download the draft file
- Metadata only records are configured through `canHaveMetadataOnlyRecords`
  config variable. Temporarely the variable is added when loading the config in
  redux. It will be removed when the config comes from external application.

Version 0.8.2 (released 2020-11-25)

- Integrates new invenio files REST backend in the file uploader

Version 0.8.1 (released 2020-11-20)

- Update Creators and Contributors field
  - Remove family name / last name
  - Add role to Creator
  - Group name, role and type on one line
- Use 1 field and 1 component for both Creators and Contributors

Version 0.7.6 (released 2020-11-03)

- Adds
  - Alternate Identifiers
  - Related Identifiers
  - Dates
  - Publisher
  - Languages
  - Publication Date
  - Title + Additional Titles
  - Description + Addtional Descriptions

Version 0.7.0 (released 2020-10-07)

- save and publish draft
- display errors

Version 0.6.0 (released 2020-09-04)

- Use link from config and publish link from API response

Version 0.5.0 (released 2020-08-19)

- Use links from API response to redirect

Version 0.4.0 (released 2020-08-03)

- Use new API for draft creation and publication

Version 0.3.0 (released 2020-06-29)

- Fix contributors to be optional
- Add creators/contributors identifiers component

Version 0.2.3 (released 2020-06-02)

Version 0.2.2 (released 2020-06-01)

Version 0.2.1 (released 2020-05-29)

- Deposit form styling.

Version 0.2.0 (released 2020-05-25)

- Sync files with latest RDM.

Version 0.1.0 (released 2020-05-22)

- Initial public release.
