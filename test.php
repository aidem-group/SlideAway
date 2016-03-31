<?php

include('/handlers/MailChimp.php');

use \DrewM\MailChimp\MailChimp;

$params = array(
	'apiKey' => '241158e6e1de81f12509d927c5f21d91-us13',
	'listId' => 'ada6ad7261'
);

$MailChimp = new MailChimp($params['apiKey']);

$result = $MailChimp->get("lists/{$params['listId']}/members");

print_r($result);
