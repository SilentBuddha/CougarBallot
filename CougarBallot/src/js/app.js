App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

listenForEvents: function() {
  App.contracts.Election.deployed().then(function(instance) {
    instance.CandidateAdded({}, {
      fromBlock: 0,
      //toBlock: 'latest'
    }).watch(function(error, event) {
      console.log("event triggered", event)
      // Reload when a new vote is recorded
      App.render();
    });
  });
},

initContract: function() {
  $.getJSON("Election.json", function(election) {
    // Instantiate a new truffle contract from the artifact
    App.contracts.Election = TruffleContract(election);
    // Connect provider to interact with contract
    App.contracts.Election.setProvider(App.web3Provider);

    //App.listenForEvents();

    return App.render();
  });
},

render: function() {
  var electionInstance;
  var loader = $("#loader");
  var content = $("#content");

  loader.show();
  content.hide();

  // Load account data
  web3.eth.getCoinbase(function(err, account) {
    if (err === null) {
      App.account = account;
      $("#accountAddress").html("Your Account: " + account);
    }
    else (window.alert(err));
  });

  // Load contract data
  App.contracts.Election.deployed().then(function(instance) {
    electionInstance = instance;
    return electionInstance.candidatesCount();
  }).then(function(candidatesCount) {
    electionInstance.ballotList(1).then(function(ballot){
      var myFS = $("#FS");
      myFS.empty();

      var mySS = $("#SS");
      mySS.empty();

      var myJS = $("#JS");
      myJS.empty();

      var mySRS = $("#SRS");
      mySRS.empty();

      var name = ballot[0];
      var style = ballot[1];
      var open = ballot[2];
      var close = ballot[3];
      var numF = ballot[4];
      var numS = ballot[5];
      var numJ = ballot[6];
      var numSr = ballot[7];

      var list = $("#Ballot");
      list.empty();

      var info = "<tr><th>" + name + "&nbsp;</th><th>&nbsp;" + style + "&nbsp;</th><th>&nbsp;" + open + "&nbsp;</th><th>&nbsp;" + close +"</td></th>"
      list.append(info);

     for (var i = 1; i <= numF; i++) {
        var addOption = "<br><label for='selectFS" + i + "'>Select Freshman Senator<br></label><select class='form-control' id='selectFS" + i + "'></select>"
        myFS.append(addOption);
        let f = "#selectFS" + i;
        let freshies = $(f);
        for (var c = 1; c <= candidatesCount; c++) {
          electionInstance.candidates(c).then(function(cand) {
            if (cand[2] == "Freshman Senator") {
              var candidateOption = "<option value='" + cand[0] + "' > " + cand[1] + "</ option>"
              freshies.append(candidateOption);
            }              

          });
        }
        //f = undefined;
        //delete(f);

      }
      

      for (var i = 1; i <= numS; i++) {
        var addOption = "<br><label for='selectSS'>Select Sophomore Senator<br></label><select class='form-control' id='selectSS" + i + "'>/select>"
        mySS.append(addOption);
        let s = "#selectSS" + i;
        let sophs = $(s);
        for (var c = 1; c <= candidatesCount; c++) {
          electionInstance.candidates(c).then(function(cand) {
            if (cand[2] == "Sophomore Senator") {
              var candidateOption = "<option value='" + cand[0] + "' > " + cand[1] + "</ option>"
            }              
            sophs.append(candidateOption);
          });
        }  
      }

      for (var i = 1; i <= numJ; i++) {
        var addOption = "<br><label for='selectJS'>Select Junior Senator<br></label><select class='form-control' id='selectJS" + i + "'>/select>"
        mySS.append(addOption);
        let j = "#selectJS" + i;
        let juniors = $(j);
        for (var c = 1; c <= candidatesCount; c++) {
          electionInstance.candidates(c).then(function(cand) {
            if (cand[2] == "Junior Senator") {
              var candidateOption = "<option value='" + cand[0] + "' > " + cand[1] + "</ option>"
            }              
            juniors.append(candidateOption);
          });
        }  
      }

      for (var i = 1; i <= numSr; i++) {
        var addOption = "<br><label for='selectSRS'>Select Senior Senator<br></label><select class='form-control' id='selectSRS" + i + "'>/select>"
        mySRS.append(addOption);
        let s = "#selectSRS" + i;
        let seniors = $(s);
        for (var c = 1; c <= candidatesCount; c++) {
          electionInstance.candidates(c).then(function(cand) {
            if (cand[2] == "Senior Senator") {
              var candidateOption = "<option value='" + cand[0] + "' > " + cand[1] + "</ option>"
            }              
            seniors.append(candidateOption);
          });
        }  
      }
    });
      
    electionInstance.setUp(1).then(function(st){

      var pseats = $("#pform");
      pseats.empty();

      var vpseats = $("#vpform");
      vpseats.empty();

      var fseats = $("#fsform");
      fseats.empty();

      var sseats = $("#ssform");
      sseats.empty();

      var jseats = $("#jsform");
      jseats.empty();

      var srseats = $("#srsform");
      srseats.empty();

      var numPC = st[0];
      var numVPC = st[1];
      var numFC = st[2];
      var numSC = st[3];
      var numJC = st[4];
      var numSrC = st[5];


      for (var i = 1; i <= numPC; i++) {
        var addSeat = "<label for='pfname" + i + "'>Candidate name:</label><input type='text' id='pfname" + i + "' name='pfname" + i+ "'><br>"  
        pseats.append(addSeat);
      }
      for (var i = 1; i <= numVPC; i++) {
        var addSeat = "<label for='vpfname" + i + "'>Candidate name:</label><input type='text' id='vpfname" + i + "'name='vpfname"+ i + "'><br>"  
        vpseats.append(addSeat);
      } 
      for (var i = 1; i <= numFC; i++) {
        var addSeat = "<label for='fsfname" + i + "'>Candidate name:</label><input type='text' id='fsfname" + i + "'name='fsfname" + i + "'><br>"  
        fseats.append(addSeat);
      }
      for (var i = 1; i <= numSC; i++) {
        var addSeat = "<label for='ssfname" + i + "'>Candidate name:</label><input type='text' id='ssfname" + i + "' name='ssfname" + i + "'><br>"   
        sseats.append(addSeat);
      }
      for (var i = 1; i <= numJC; i++) {
        var addSeat = "<label for='jsfname" + i + "'>Candidate name:</label><input type='text' id='jsfname" + i + "' name='jsfname" + i + "'><br>"   
        jseats.append(addSeat);
      }
      for (var i = 1; i <= numSrC; i++) {
        var addSeat = "<label for='sesfname" + i + "'>Candidate name:</label><input type='text' id='sesfname" + i + "' name='sesfname" + i + "'><br>"   
        srseats.append(addSeat);
      }
    });

    var selectType = $("#selectType");
    selectType.empty();
    var rc = "<option value='Ranked Choice'>Ranked Choice Ballot</ option>"
    selectType.append(rc);
    var smp = "<option value='SMP'>SMP Ballot</ option>"
    selectType.append(smp);

    var candidatesResults = $("#candidatesResults");
    candidatesResults.empty();

    var candidatesSelect = $('#candidatesSelect');
    candidatesSelect.empty();

    var candidatesList = $("#candidatesList");
    candidatesList.empty();

    var selectPresident = $("#selectPresident");
    selectPresident.empty();
    var pr = $("#PResults");
    pr.empty();

    var selectVP = $("#selectVP");
    selectVP.empty();
    var vpr = $("#VPResults");
    vpr.empty();

    var fr = $("#FSResults");
    fr.empty();

    var sr = $("#SSResults");
    sr.empty();

    var jr = $("#JSResults");
    jr.empty();

    var snr = $("#SRSResults");
    snr.empty();

    for (var i = 1; i <= candidatesCount; i++) {
      electionInstance.candidates(i).then(function(candidate) {
        var id = candidate[0];
        var name = candidate[1];
        var office = candidate[2];
        var voteCount = candidate[3];

        // Render candidate Result
        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
        

        var newCandidate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + office + "</td></tr>"
        candidatesList.append(newCandidate);

        // Render candidate ballot option
        var candidateOption = "<option value='" + id + "' >" + name + "</ option>"

        if (office == "President") {
          selectPresident.append(candidateOption);
          pr.append(candidateTemplate);
        }
        if (office == "Vice President") {
          selectVP.append(candidateOption);
          vpr.append(candidateTemplate);
        }
        if (office == "Freshman Senator") {
          fr.append(candidateTemplate);
        }
        if (office == "Sophomore Senator") {
          sr.append(candidateTemplate);
        }
        if (office == "Junior Senator") {
          jr.append(candidateTemplate);
        }       
        if (office == "Senior Senator") {
          snr.append(candidateTemplate);
        }

      });
    }
  }).then(function(hasVoted) {
    //if 
    // Do not allow a user to vote
    if(hasVoted) {
      $('form').hide();
    }
      loader.hide();
      content.show();
  }).catch(function(error) {
      console.warn(error);
  });
},

  submitCandidate: function() {
    var tranxcnt = 1;
    var electionInstance;
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.setUp(1);
    }).then(function(struct) {
      var numPC = struct[0];
      var numVPC = struct[1];
      var numFC = struct[2];
      var numSC = struct[3];
      var numJC = struct[4];
      var numSrC = struct[5];
      for (var i = 1; i <= numPC; i++) {
        var term = "#pfname" + i;
        var name = $(term).val();
        //window.alert("Right before transaction");
        electionInstance.addCandidate(tranxcnt, name, "President", {from: App.account} );
        tranxcnt++;
      }
      for (var i = 1; i <= numVPC; i++) {
        var term = "#vpfname" + i;
        var name = $(term).val();
        //window.alert("Right before transaction");
        electionInstance.addCandidate(tranxcnt, name, "Vice President", {from: App.account} );
        tranxcnt++;
      }

      for (var i = 1; i <= numFC; i++) {
        var term = "#fsfname" + i;
        var name = $(term).val();
        //window.alert("Right before transaction");
        electionInstance.addCandidate(tranxcnt, name, "Freshman Senator", {from: App.account} );
        tranxcnt++;
      }
      for (var i = 1; i <= numSC; i++) {
        var term = "#ssfname" + i;
        var name = $(term).val();
        //window.alert("Right before transaction");
        electionInstance.addCandidate(tranxcnt, name, "Sophomore Senator", {from: App.account} );
        tranxcnt++;
      }
      for (var i = 1; i <= numJC; i++) {
        var term = "#jsfname" + i;
        var name = $(term).val();
        //window.alert("Right before transaction");
        electionInstance.addCandidate(tranxcnt, name, "Junior Senator", {from: App.account} );
        tranxcnt++;
      }
      var i;
      var msg;
      if (numSrC > 1) {
        for (i = 1; i < numSrC; i++) {
          var term = "#sesfname" + i;
          var name = $(term).val();
          electionInstance.addCandidate(tranxcnt, name, "Senior Senator", {from: App.account} );
          tranxcnt++;
        }
        var term = "#sesfname" + i;
        var name = $(term).val();
        msg = "This involved " + tranxcnt + " transactions. Please confirm all transactions. The first transactions may take a litte longer.";
        window.alert(msg);
        electionInstance.addCandidate(tranxcnt, name, "Senior Senator", {from: App.account} );
      }
      else {
        var name = $("#sesfname1").val();
        msg = "This involved " + tranxcnt + " transactions. Please confirm all transactions. The first transactions may take a litte longer.";
        window.alert(msg);
        return electionInstance.addCandidate(tranxcnt, name, "Senior Senator", {from: App.account} ); 
      }                            
    }).catch(function(err) {
      console.error(err);
    });
    //window.alert("Exited function");
  },

  displayVote: function() {
    var electionInstance;
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.checkStatus({from: App.account});
    }).then(function(val) {
      //window.alert(val);
      if (val === true) {
        window.alert("You have already voted. If you believe you received this message in error, please contact the support desk.");
        //location.replace("/index.html");
      }
      else {return electionInstance.ballotList(1);}
    }).then(function(ballot) {
      var start = Date.parse(ballot[2]);
      var end = Date.parse(ballot[3]);
      var now = Date.now();
      if ((now >= start) && (now <= end)) {
        location.replace("/vote.html")
      }
      else {
        if (now >= start) {window.alert("The ballot has already closed. We are sorry you missed the vote.");}
        else {window.alert("The ballot has not opened yet. Please logout and try again later.");}
      }
    }).catch(function(err) {
      console.error(err);
    });
  },

  displayResults: function() {
    App.contracts.Election.deployed().then(function(instance) {
      return instance.ballotList(1);
    }).then(function(ballot) {
      var start = Date.parse(ballot[2]);
      var end = Date.parse(ballot[3]);
      var now = Date.now();
      if (now >= start && now <= end) {
        window.alert("The ballot is currently open for voting. For security and impartiality, you cannot access the results until the ballot has closed.");
      }
      else {location.replace("/results.html");}
    }).catch(function(err) {
      console.error(err);
    });
  },

  initializeBallot: function() {
    var electionInstance;
    var numF = $("#numFSSeats").val();
    var numS = $("#numSSSeats").val();
    var numJ = $("#numJSSeats").val();
    var numSr = $("#numSRSSeats").val();
    var numPC = $("#numPCands").val();
    var numVPC = $("#numVPCands").val();
    var numFC = $("#numFSCands").val();
    var numSC = $("#numSSCands").val();
    var numJC = $("#numJSCands").val();
    var numSrC = $("#numSRSCands").val();
    var type = $("#selectType").val();
    var name = $("#ballot_name").val();
    var begin = $("#start-time").val();
    var end = $("#end-time").val();
    //window.alert("got here");
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;//return instance.createBallot(name, begin, end, numF, numS, numJ, numSr, numFC, numSC, numJC, numSrC, { from: App.account });
      //$("#form").hide();
      electionInstance.createBallot(name, type, begin, end, numF, numS, numJ, numSr, { from: App.account });
    }).then(function(r) {
      window.alert("This involved 2 transactions. Please confirm both.");
    return electionInstance.createStructure(numPC, numVPC, numFC, numSC, numJC, numSrC, {from: App.account});
    }).catch(function(err) {
      console.error(err);
    });
    //window.alert("Exited function");
  },


  castVote: function() {
    var tranxcnt = 1;
    var electionInstance;
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.checkStatus({from: App.account});
    }).then(function(val) {
      //window.alert(val);
      if (val === true) {
        window.alert("You have already voted and will be redirected to the home page. If you believe you received this message in error, please contact the support desk.");
        location.replace("/index.html");
      }
      else {return electionInstance.ballotList(1);}
    }).then(function(struct) {
      var start = Date.parse(struct[2]);
      var end = Date.parse(struct[3]);
      var now = Date.now();
      if (now >= end) { 
        window.alert("The ballot has closed. You are about to be redirected to the home page.")
        location.replace("/index.html");
      }
      else {
        var numFS= struct[4];
        var numSS = struct[5];
        var numJS = struct[6];
        var numSRS = struct[7];

        var pid = $("#selectPresident").val();
        electionInstance.vote(pid, {from: App.account} );

        tranxcnt++;
        var vpid = $("#selectVP").val();
        electionInstance.vote(vpid, {from: App.account} );

        tranxcnt++;
        for (var i = 1; i <= numFS; i++) {
          var term = "#selectFS" + i;
          var fid = $(term).val();
          //window.alert("Right before transaction");
          electionInstance.vote(fid, {from: App.account} );
          tranxcnt++;
        }

        for (var i = 1; i <= numSS; i++) {
          var term = "#selectSS" + i;
          var sid = $(term).val();
          //window.alert("Right before transaction");
          electionInstance.vote(sid, {from: App.account} );
          tranxcnt++;
        }

        for (var i = 1; i <= numJS; i++) {
          var term = "#selectJS" + i;
          var jid = $(term).val();
          //window.alert("Right before transaction");
          electionInstance.vote(jid, {from: App.account} );
          tranxcnt++;
        }

        var i = 1;

        if (numSRS > 1) {
          for (i = 1; i < numSRS; i++) {
            var term = "#selectSRS" + i;
            var srid = $(term).val();
            electionInstance.vote(srid, {from: App.account} );
            tranxcnt++;
          }
          var term = "#selectSRS" + i;
          var srid = $(term).val();
          electionInstance.vote(srid, {from: App.account} );
        }
        
        else {
          var srid = $("#selectSRS1").val();
          //var srid = $(term).val();
          electionInstance.vote(srid, {from: App.account} ); 
        } 

        tranxcnt++;
        msg = "This involved " + tranxcnt + " transactions. Please confirm all transactions. The first transactions may take a litte longer.";
        window.alert(msg);
        return electionInstance.completedVote( {from: App.account} );
      }
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});