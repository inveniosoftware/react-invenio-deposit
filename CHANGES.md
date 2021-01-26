# Changes

Version 0.10.4 (released 2021-01-26)

* Fills out full row in DataField
* Renames RelatedIdentifiers to RelatedWorks

Version 0.10.3 (released 2021-01-25)

* Hide file uploader warning when clicking on "Metadata only" checkbox

Version 0.10.2 (released 2021-01-25)

* Bump react invenio forms version
* Use onClick handler on array delete buttons

Version 0.10.1 (released 2021-01-22)

* Add DepositFormTitle
* LicenseField
  - Split add dropdown to separate buttons
  - Fix issue with space keystroke
  - Modal's content is scrollable now
* Resource type/subtype component is merged in one
* FileUploader
  - Fix metadata only checkbox bug
  - Centers "Pending" label
  - Upload section is hidden when "Metadata only" record
  - Use Message component for uploads note

Version 0.10.0 (released 2021-01-18)

* Add Delete button

Version 0.9.9 (released 2021-01-08)

* Disable Publish button unless deposit was successfully saved

Version 0.9.8 (released 2021-01-07)

* Add support for partial save
* Add form feedback message

Version 0.9.7 (released 2021-01-07)

Version 0.9.6 (released 2020-12-11)

Version 0.9.5 (released 2020-12-11)

Version 0.9.4 (released 2020-12-11)

Version 0.9.3 (released 2020-12-10)

Version 0.9.2 (released 2020-12-09)

Version 0.9.1 (released 2020-12-07)

Version 0.8.8 (released 2020-11-27)

* Fix metadata only checkbox when it was clicked without a draft created

Version 0.8.7 (released 2020-11-27)

* Disable publish if files are not uploaded or record marked as metadata only.

Version 0.8.6 (released 2020-11-27)

* Expose `isDraftRecord` to the FileUploader component

Version 0.8.5 (released 2020-11-26)

* Set default preview to the backend
* Enable/disable files

Version 0.8.4 (released 2020-11-25)

* Show 1st/last name if person, name if org in Creators and Contributors field.

Version 0.8.3 (released 2020-11-25)

* Filename is a link to download the draft file
* Metadata only records are configured through `canHaveMetadataOnlyRecords`
  config variable. Temporarely the variable is added when loading the config in
  redux. It will be removed when the config comes from external application.

Version 0.8.2 (released 2020-11-25)

* Integrates new invenio files REST backend in the file uploader

Version 0.8.1 (released 2020-11-20)

* Update Creators and Contributors field
    - Remove family name / last name
    - Add role to Creator
    - Group name, role and type on one line
* Use 1 field and 1 component for both Creators and Contributors

Version 0.7.6 (released 2020-11-03)

* Adds
    - Alternate Identifiers
    - Related Identifiers
    - Dates
    - Publisher
    - Languages
    - Publication Date
    - Title + Additional Titles
    - Description + Addtional Descriptions

Version 0.7.0 (released 2020-10-07)

* save and publish draft
* display errors

Version 0.6.0 (released 2020-09-04)

* Use link from config and publish link from API response

Version 0.5.0 (released 2020-08-19)

* Use links from API response to redirect

Version 0.4.0 (released 2020-08-03)

* Use new API for draft creation and publication

Version 0.3.0 (released 2020-06-29)

* Fix contributors to be optional
* Add creators/contributors identifiers component

Version 0.2.3 (released 2020-06-02)

Version 0.2.2 (released 2020-06-01)

Version 0.2.1 (released 2020-05-29)

* Deposit form styling.

Version 0.2.0 (released 2020-05-25)

* Sync files with latest RDM.

Version 0.1.0 (released 2020-05-22)

* Initial public release.
