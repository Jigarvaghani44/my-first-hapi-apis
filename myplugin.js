'use strict';

exports.plugin= {
    pkg:require('./package.json'),
    register :async function(server,option){
        server.route({
            method :"GET",
            path:"/test",
            handler : function(req,h){
                return "this is a test page, ohk.."
            }
        });
        // await someAsyncMethods();
    }
}
// module.exports=myPlugin;
