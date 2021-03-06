<?php

set_time_limit(30);
error_reporting(E_ALL);
ini_set('error_reporting', E_ALL);
ini_set('display_errors',1);

if(sizeof($argv) < 2) {echo "nono"; die;}
$cn = $argv[1];

// config
$ldapserver = '10.30.64.11';
$ldapuser = 'neowiz\\adsync';  
$ldappass = 'spdhdnlwm1234!';
$ldaptree = "OU=NeoWiz,DC=ds,DC=neowiz,DC=com";

// connect 
$ldapconn = ldap_connect($ldapserver) or die("err:Could not connect to LDAP server.");

if($ldapconn) {
    // binding to ldap server
    $ldapbind = ldap_bind($ldapconn, $ldapuser, $ldappass) or die ("err:Error trying to bind: ".ldap_error($ldapconn));
    // verify binding
    if ($ldapbind) {
        
        $result = ldap_search($ldapconn,$ldaptree, "(cn=$cn)") or die ("err:Error in search query: ".ldap_error($ldapconn));
        $data = ldap_get_entries($ldapconn, $result);
        
        // SHOW ALL DATA
        // echo '<h1>Dump all data</h1><pre>';
        // print_r($data);    
        // echo '</pre>';
        
        // iterate over array and print data for each entry
        // echo '<h1>Show me the users</h1>';
        for ($i=0; $i<$data["count"]; $i++) {
            echo $data[$i]["cn"][0];
            echo ','.iconv("euc-kr","utf-8",$data[$i]["company"][0]);
            echo ','.iconv("euc-kr","utf-8",$data[$i]["department"][0]);
            echo ','.iconv("euc-kr","utf-8",$data[$i]["displayname"][0]);
        }
        // print number of entries found
        // echo "Number of entries found: " . ldap_count_entries($ldapconn, $result);
    } else {
        echo "err:LDAP bind failed...";
    }
}

// all done? clean up
ldap_close($ldapconn);
?>

