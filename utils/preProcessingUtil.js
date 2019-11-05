'use-strict';

export default class PreProcessingUtil {
   
    static mapResultClassification(result) {
       return result === 1 ? 'component_relevant' : result === 0 ? 'no_relevant' : 'identification_item';
    }

}
