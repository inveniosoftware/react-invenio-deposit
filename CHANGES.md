# Changes

Version 0.15.8 (released 2021-07-20)
* improve deposit form error display

Version 0.15.6 (released 2021-07-14)
* improvements to subjects vocabulary integration
* fix subjects label bug

Version 0.15.5 (released 2021-07-09)
* subjects vocabulary integration

Version 0.15.4 (released 2021-07-09)
* affiliations vocabulary integration

Version 0.15.3 (released 2021-07-06)
* subjects is now a vocabulary field
* some translation support

Version 0.15.2 (released 2021-07-01)
* type and language vocabularies

Version 0.14.0 (released 2021-05-19)

* resource_type is now a vocabulary field (i.e. of the shape `{id: <id>}`),
  so changes are made to accomodate this
* Mark May release

Version 0.13.5 (released 2021-04-16)

* Pass files.enabled in the draft API payload
* Disable Publish button if errors
* Use backend error message to indicate missing files

Version 0.13.4 (released 2021-04-13)

Version 0.13.3 (released 2021-04-07)

Version 0.13.2 (released 2021-03-31)

Version 0.13.1 (released 2021-03-26)

Version 0.12.2 (released 2021-03-26)

Version 0.12.1 (released 2021-03-23)

* New version button
* Creatibutors: focus on family name/name when modal opens
* Change styling of md5 checksum text

Version 0.11.10 (released 2021-02-26)

* clearable role on creators only

Version 0.11.6 (released 2021-02-25)

* access: adds icon and update placeholder

Version 0.11.5 (released 2021-02-24)

* License: adds url validation for custom license link
* License: show readmore when no description

Version 0.11.4 (released 2021-02-23)

* Remove hardcoded owned_by user value from the serializer class

Version 0.11.1 (released 2021-02-10)

* UX fixes into CreatibutorsField
* LicenseField
  - UX fixes
  - Add ordering of licenses
* Global UX fixes towards a consistent deposit UI

Version 0.11.0 (released 2021-02-03)

* Add helptext for PublicationDate

Version 0.10.9 (released 2021-01-29)

* Fix bug in license results.

Version 0.10.8 (released 2021-01-29)

* Change license modal filter values

Version 0.10.7 (released 2021-01-29)

* Restyles Delete button confirm dialog's buttons

Version 0.10.6 (released 2021-01-29)

* Various UX fixes
* Exposes serializeLicenses prop for LicenseFIeld to serialize vocab response

Version 0.10.5 (released 2021-01-28)

* Adds ComingSoon component
* Refactors Creatibutor component


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
