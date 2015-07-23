<?php
/**
 * Com
 *
 * @author      Dave Li <dave@moyoweb.nl>
 * @category    Nooku
 * @package     Socialhub
 * @subpackage  ...
 * @uses        Com_
 */
 
defined('KOOWA') or die('Protected resource');

class ComEventsControllerToolbarDays extends ComDefaultControllerToolbarDefault
{
	public function getCommands()
	{
		$this->addCommand('refresh', array('icon' => 'icon-32-download', 'is_allowed' => true, 'attribs' => array('data-novalidate' => 'novalidate')));

		return parent::getCommands();
	}
}