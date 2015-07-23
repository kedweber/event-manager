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

class ComEventsControllerEvent extends ComDefaultControllerDefault
{
	/**
	 * @return array|KConfig
	 */
	public function getRequest()
	{
		$this->_request->limit = $this->_request->limit ? $this->_request->limit : 20;

		return $this->_request;
	}
}