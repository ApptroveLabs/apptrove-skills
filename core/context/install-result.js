class InstallResult {


    constructor(platform){

        this.platform = platform;

        this.steps = {};

        this.success = true;

    }


    add(
        name,
        result
    ){

        this.steps[name] = result;

    }


}


module.exports = InstallResult;