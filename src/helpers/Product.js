class Product {
    constructor() {
        this.product = {}
    }
    addKey(key, detail) {
        if (detail.indexOf(key) > -1) {
            const value = detail.split(key)[detail.split(key).length - 1].split(":")[detail.split(key).length - 1]
            this.product[key] = value;
        }

    }
    addProperty(keyName, value) {
        this.product[keyName] = value
    }
    filter(requirementKeys, detail) {
        for (let index = 0; index < requirementKeys.length; index++) {
            const element = requirementKeys[index];
            if (detail.indexOf(element) > -1) {
                //Product has that detail
                const value = detail.split(element)[detail.split(element).length - 1].split(":")[detail.split(element).length - 1]
                this.product[element] = value
            }
        }
    }
    isValid(requirementKeys) {
        let isValid = true;

        requirementKeys.forEach((key) => {
            if (!(Object.keys(this.product).includes(key))) {
                isValid = false;
            }
        })
        return isValid;

    }

}

export default Product