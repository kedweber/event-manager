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

class ComEventsViewEventJson extends KViewJson
{
	protected function _getItem()
	{
		$data = parent::_getItem();

		if($this->getModel()->getItem()->days instanceof KDatabaseRowsetAbstract) {
			$data['item'] = array_merge($data['item'], array('days' => array_values($this->getModel()->getItem()->days->toArray())));
		}

		return $data;
	}
}