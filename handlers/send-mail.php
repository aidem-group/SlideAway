<?php

include 'MailChimp.php';

use \DrewM\MailChimp\MailChimp;

$mainEmail = 'SlideAway <info@slideaway.ru>';

if (!$_POST) exit();

$dc = 'UTF-8';
$sc = 'windows-1251';
$name = 'Request';

$header = array(
	'name'      => mime_header_encode($name, $dc, $sc),
	'emailFrom' => mime_header_encode('admin@slideaway.ru', $dc, $sc),
	'email'     => mime_header_encode($mainEmail, $dc, $sc)
);

if($_POST['action'] == 'request'){
	$subject = 'Новая заявка';

	$mailchimpData = array(
		'email' => filter_var($_POST['contacts'], FILTER_VALIDATE_EMAIL)
	);

	$interest = $_POST['interest'] ? implode(', ', $_POST['interest']) : 'Не указано';
	$beginner = $_POST['beginner'] ? 'Да' : 'Нет';

	$message = <<<__MSG
		<b>Новичок:</b> {$beginner}<br>
		<b>Интересует:</b> {$interest}<br>
		<b>Имя:</b> {$_POST['name']}<br>
		<b>Контакты:</b> {$_POST['contacts']}<br>
		<b>Вопрос:</b> {$_POST['question']}<br>
__MSG;
} elseif ($_POST['action'] == 'subscribe'){
	$mailchimpData = array(
		'email' => filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)
	);

	$subject = 'Новый подписчик';
	$message = "Email: {$_POST['email']}";
}

$headers  = ''
.	"Content-type: text/html; charset=windows-1251 \r\n"
.	"From: SlideAway <{$header['emailFrom']}>";

mail($mainEmail, $subject, iconv($dc, "{$sc}//IGNORE", $message), $headers);

if($mailchimpData['email']){
	$params = array(
		'apiKey' => '3fc848699384c6053a975afa570c0bc7-us12',
		'listId' => 'b2e6ff8596'
	);

	$MailChimp = new MailChimp($params['apiKey']);

	$result = $MailChimp->post("lists/{$params['listId']}/members", array(
        'email_address' => $mailchimpData['email'],
        'status'        => 'subscribed'
    ));
}

echo 'Success.';

function mime_header_encode($str, $data_charset, $send_charset) {
	$str = iconv($data_charset, "{$send_charset}//IGNORE", $str);

	return ("=?{$send_charset}?B?" . base64_encode($str) . '?=');
}
