net = require('net');
http = require('http');

// global variables
clientList = [];

// Autogenerated with DRAKON Editor 1.22

function Main() {
    // item 4
    console.log("DRAKON-Javascript chat server");
    console.log("=============================");
    // item 13
    var server = net.createServer( handleConnection ),
        port = Number(process.env.PORT || 8080);
    // item 30
    server.listen(port);
    console.log("listening on port " + port);
}

function addClient(socket) {
    // item 170
    clientList.push(socket);
}

function broadcastToRoom(room, message) {
    // item 53
    if (room) {
        // item 58
        var clients = clientsInRoom(room),
            i = 0,
            length = clients.length;
        // item 560001
        i = 0
        while (true) {
            // item 560002
            if (i < length) {
                
            } else {
                break;
            }
            // item 59
            sendMessage(clients[i], message);
            // item 560003
            i +=1
        }
    } else {
        
    }
}

function catfactHandler(socket, data) {
    // item 268
    http.get("http://catfacts-api.appspot.com/api/facts?number=1", function(res) {
      res.on('data', function(chunk) {
        var fact = JSON.parse(chunk)['facts'][0];
        sendMessage(socket, fact);
      });
    });
}

function chomp(str) {
    // item 155
    return str.replace(/\r?\n|\r/, "");
}

function clientsInRoom(room) {
    // item 172
    var length = clientList.length,
        clients = [],
        client;
    // item 2480001
    i = 0
    while (true) {
        // item 2480002
        if (i < length) {
            
        } else {
            break;
        }
        // item 252
        if (room == clientList[i].room) {
            // item 250
            clients.push(clientList[i])
        } else {
            
        }
        // item 2480003
        i+=1
    }
    // item 251
    return clients;
}

function findClientByName(name) {
    // item 210
    var client;
    // item 2550001
    var i = 0
    while (true) {
        // item 2550002
        if (i < length) {
            
        } else {
            break;
        }
        // item 258
        if (clientList[i].name == name) {
            // item 261
            client = clientList[i];
            break;
        } else {
            
        }
        // item 2550003
        i+=1
    }
    // item 262
    return client;
}

function handleConnection(socket) {
    // item 19
    console.log('connection established');
    
    sendMessage(socket, "Welcome to the XYZ chat server");
    sendMessage(socket, "Login Name?");
    
    addClient(socket);
    
    socket.on('data', function(data) { onDataReceived(socket, data) });
    socket.on('end', function() { onSocketEnd(socket) });
}

function isUniqueName(name) {
    // item 198
    if (!name) { 
      return false;
    }
    
    var client;
    
    for (var idx in clientList) { 
      client = clientList[idx];
    
      if (client.name == name) {
        return false;
      }
    }
    
    return true;
}

function joinHandler(socket, data) {
    // item 164
    if (!data) {
      sendMessage(socket, "Invalid room name");
      return;
    }
    
    broadcastToRoom(data, "* new user joined chat: " + socket.name);
    
    var clients = clientsInRoom(data),
        names = [],
        client, msg, name;
    
    for (var idx in clients) {
      client = clients[idx];
      names.push(client.name);
    }
    
    msg = "entering room: " + data;
    
    if (names.length) {
      for (var idx in names) { 
        name = names[idx];
        msg += "\n * " + name;
      }
      
      msg += "\nend of list";
    }
    
    sendMessage(socket, msg);
    
    socket.room = data;
}

function leaveHandler(socket, data) {
    // item 192
    leaveRoom(socket, data);
}

function leaveRoom(socket, data) {
    // item 234
    if (socket.room) {
        // item 191
        broadcastToRoom(socket.room, "user has left chat: " + socket.name);
        delete(socket.room);
    } else {
        
    }
}

function messageHandler(socket, data) {
    // item 244
    if (socket.room) {
        // item 171
        msg = socket.name + ': ' + data;
        
        broadcastToRoom(socket.room, msg)
    } else {
        // item 247
        msg = "Nobody hears you. (Try joining a room: `/join <room>`!)";
        
        sendMessage(socket, msg);
    }
}

function onDataReceived(socket, data) {
    // item 89
    packetHandler(socket, chomp(data.toString()));
}

function onSocketEnd(socket) {
    // item 39
    leaveRoom(socket, null);
    removeClient(socket);
}

function packetHandler(socket, data) {
    // item 215
    if (socket.name) {
        
    } else {
        // item 216
        setNameHandler(socket, data);
        return;
    }
    // item 240
    if (data.toString()[0] != "/") {
        
    } else {
        // item 241
        var split = data.indexOf(' ');
        
        if (split == -1) {
          split = data.length;
        }
        
        var keyword = data.substr(1, split - 1);
        var args = data.substr(split + 1);
        try {
          //eval? DEAL WITH IT (╯°□°）╯︵ ┻━┻)
          eval(keyword + 'Handler(socket, args)'); 
        } catch(e) { }
        return;
    }
    // item 222
    messageHandler(socket, data);
    return;
}

function quitHandler(socket, data) {
    // item 185
    leaveRoom(socket, data);
    
    sendMessage(socket, "BYE");
    
    removeClient(socket);
    
    try {
      socket.destroy();
    } catch(e) {}
}

function removeClient(socket) {
    // item 65
    clientList.splice(clientList.indexOf(socket), 1);
}

function roomNames() {
    // item 157
    var names = [];
    var room;
    
    for (var client in clientList) {
      room = clientList[client].room;
    
      if (room != null) {
        if (names[room]) {
          names[room] = names[room] + 1;
        } else {
          names[room] = 1;
        }   
      }
    }
    
    var resp = [];
    
    for (var name in names) { 
      resp.push(name + ' (' + names[name] + ')');
    }
    
    return resp;
}

function roomsHandler(socket, data) {
    // item 156
    var names = roomNames();
    var msg = "";
    // item 159
    if (names.length == 0) {
        // item 158
        msg = "There are no active rooms.  `/join <name>` one!";
    } else {
        // item 163
        msg = "Active rooms are:\n"
        
        var length = names.length;
        for (var i = 0; i < length; i += 1) {
          msg += " * " + names[i];
        }
        
        msg += "\nend of list.";
    }
    // item 162
    sendMessage(socket, msg);
}

function sendMessage(client, message) {
    // item 77
    try { 
      client.write(message + "\n");
    } catch (e) {
      console.log("Socket write exception: " + e);
      removeClient(client);
    }
}

function setName(socket, data) {
    // item 272
    var name = data.replace(/\s/g, '_');
    // item 269
    if (isUniqueName(name)) {
        // item 173
        socket.name = name;
    } else {
        
    }
    // item 273
    return socket.name;
}

function setNameHandler(socket, data) {
    // item 229
    if (setName(socket, data)) {
        // item 232
        sendMessage(socket, "Welcome " + socket.name + "!");
    } else {
        // item 233
        sendMessage(socket, "Sorry, name taken.");
        sendMessage(socket, "Login Name?");
    }
}

function whisperHandler(socket, data) {
    // item 204
    var split = data.indexOf(' ');
    
    if (split == -1) {
      split = data.length;
    }
    
    var name = data.substr(0, split);
    
    var client = findClientByName(name);
    
    if (client != socket) {
      var message = socket.name + ': ' + data.substr(split + 1);
      
      if (client) {
        sendMessage(socket, '(whisper to ' + client.name + ') ' + message);
        sendMessage(client, '(whisper)' + socket.name + ') ' + message);
      } else { 
        sendMessage(socket, "That user cannot be found.");
      }
    } else {
      sendMessage(socket, "You whisper to yourself.");
    }
}

Main();
