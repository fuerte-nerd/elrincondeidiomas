const areAnyChecked = require(path.join(__dirname, '../utility/areAnyChecked'));
const overEighteen = require(path.join(__dirname, '../utility/overEighteen'));
const dateFromString = require(path.join(__dirname, '../utility/dateFromString'));

module.exports = {
    checkForm(fields){
        const dobDateObject = dateFromString(fields.dob.value);
        if (!overEighteen(dobDateObject)) {
            if(!this.parentalCheck(fields)){ return false }
        };
    
        // // Mobile phone validation
        if(!this.isMobile(fields.mobilephone)){ return false }
    
        // Home phone number validation
        if (fields.homephone.value !== '') { if(!this.isMobileOrHome(fields.homephone)){ return false }; }
    
        // Postcode validation
        if(!this.isPostcode(fields.postcode)){ return false };
       
        // Current languages
        if(!this.currentLanguages(fields.current_languages)){ return false };
        
        // Studying languages
        if(!this.studyingLanguages(fields.studying_languages)){ return false };

        return true;
    },
    parentalCheck(fields){
        // Check if student is over 18. If not, prompt to complete parent information
        const parentalFields = [fields.name_of_parent.value, fields.parent_emergency.value, fields.value];
        if (parentalFields.includes('')) {
            this.showError('This student is under 18. Please complete all of the parent details.', fields.name_of_parent)
            return false;
        }
        const is_parent_phone_number = /^6\d{8}$|^7\d{8}$|^928\d{6}$/g.test(fields.parent_emergency.value);
        if (!is_parent_phone_number) {
            this.showError('You have entered an invalid emergency phone number', fields.parent_emergency);
            return false;
        }
        return true;
    },
    isMobile(field){
        const is_mobile = /^6\d{8}$|^7\d{8}$/g.test(field.value);
        if (!is_mobile) {
            this.showError('You have entered an invalid mobile number.', field);
            return false;
        }
        return true;
    },
    isMobileOrHome(field){
        const is_phone_number = /^6\d{8}$|^7\d{8}$|^928\d{6}$/g.test(field.value)
        if (!is_phone_number) {
            this.showError('You have entered an invalid phone number.', field);
            return false;
        }
        return true;
    },
    isPostcode(field){
        const is_post_code = /^\d{5}$/.test(field.value);
        if (!is_post_code) {
            this.showError('You have entered an invalid postcode.', field)
            return false;
        }
        return true;
    },
    currentLanguages(field){
        if (areAnyChecked(field)) {
            this.showError('Please select at least one current language.', field[0])
            return false;
        }
        return true;
    },
    studyingLanguages(field){
        if (areAnyChecked(field)) {
            this.showError('Please select at least one studying language.', field[0])
            return false;
        }
        return true;
    },
    showError(msg, field){
        const error_display = document.getElementById('error_display');
        error_display.textContent = msg;
        setTimeout(() => {
            error_display.textContent = null;
            field.focus();
        }, 2000)
    } 
}