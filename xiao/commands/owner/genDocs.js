const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');
const myLoggers = require('log4js');
myLoggers.configure({
    appenders: { mylogger: { type:"file", filename: "/app/xiao/logs/docs.log" } },
    categories: { default: { appenders:["mylogger"], level:"ALL" } }
});
const logger = myLoggers.getLogger("default");

module.exports = class GAnnCommand extends Command {
  constructor(bot) {
    super(bot, {
      name: 'gendocs',
      aliases: ['gd'],
      group: 'owner',
      memberName: 'gendocs',
      description: 'Genarates command documents.',
      ownerOnly: true,
      guarded: true
    });
  }
run (msg) {
  try {
for(const commandx of this.client.registry.commands) {
  console.log(commandx[1].name)
var command = commandx[1]
if ( command.group.name == 'Default Commands Group' ) continue
if ( command.name == 'chips' ) continue
if ( command.name == 'daily' ) continue
if ( command.name == 'deposit' ) continue
if ( command.name == 'withdraw' ) continue


function checkArgs() {
  try {
    const argsx = command.argsCollector.args
    return argsx
  } catch (e) {
    console.log(e)
    return null
  }
}

function getUsrPerms() {
  const cmdusrp = command.userPermissions
  if (cmdusrp == null) return 'Default'
  else return cmdusrp
}
      
const args2 = checkArgs()
//console.log(args2.Argument.key)
if (args2 != null) {
  
function x() {
  for(const x of args2) {
          return [x.key, x.type.id, x.prompt]
    
    return [x.key, x.type.id, x.prompt]
  }
}    
      
console.log(`
## ${command.name}\n
${command.name} ${command.group.name} - ${command.description}\n
**Aliases**: ${command.aliases.join(', ') || 'None'}\n
**Group**: ${command.group.name} (\`${command.groupID}:${command.memberName}\`)\n
**Format**: ${msg.anyUsage(`${command.name} ${command.format || ''}`)}\n
**User Permissions**: ${getUsrPerms()}
`) 
  /* | Param | Type | Desciption|\n
| ------ | ------------------- | ------------ |\n
| ${x()[0]} |<code> ${x()[1]} </code> | ${x()[2]}|\n*/
  const res = `
## ${command.name}new
${command.name} ${command.group.name} - ${command.description}new
**Aliases**: ${command.aliases.join(', ') || 'None'}new
**Group**: ${command.group.name} (\`${command.groupID}:${command.memberName}\`)new
**Format**: ${msg.anyUsage(`${command.name} ${command.format || ''}`)}new
**User Permissions**: ${getUsrPerms()}
`
  logger.info(res); 
  
/*  | Param | Type | Desciption|new
| ------ | ------------------- | ------------ |new
| ${x()[0]} |<code> ${x()[1]} </code> | ${x()[2]}|new*/

/*const results = 'o'
  const fs = require('fs');
fs.writeFile("/tmp/test", results, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); */
} else if (args2 == null){
  console.log(`
## ${command.name} \n
${command.name} ${command.group.name} - ${command.description}\n
**Aliases**: ${command.aliases.join(', ') || 'None'}\n
**Group**: ${command.group.name} (\`${command.groupID}:${command.memberName}\`)\n
**Format**: ${msg.anyUsage(`${command.name} ${command.format || ''}`)}\n
**User Permissions**: ${getUsrPerms()}
`) 
  const res = `
## ${command.name}new
${command.name} ${command.group.name} - ${command.description}new
**Aliases**: ${command.aliases.join(', ') || 'None'}new
**Group**: ${command.group.name} (\`${command.groupID}:${command.memberName}\`)new
**Format**: ${msg.anyUsage(`${command.name} ${command.format || ''}`)}new
**User Permissions**: ${getUsrPerms()}
`
  logger.info(res);

}
}
    /*resArr.forEach(function(resx) {
    const fs = require('fs');
    fs.writeFileSync("/app/xiao/bin/docs.txt", resx,)
    })*/
} catch (e) {

  //console.log(e)
}
}
}