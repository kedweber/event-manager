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

class ComEventsDatabaseBehaviorDateable extends KDatabaseBehaviorAbstract
{
	/**
	 * @param KCommandContext $context
	 */
	protected function _beforeTableInsert(KCommandContext $context)
	{
		$this->_saveDays();
	}

	protected function _beforeTableUpdate(KCommandContext $context)
	{
		$this->_saveDays();
	}

	protected function _saveDays()
	{
		//TODO: Delete old days.

		$ids = array();

		foreach($this->days as $day) {
            // But, but what if we don't have an id???? Then we have to create it.

            if($day['id']) {
                $row = $this->getService('com://admin/events.model.days')->id($day['id'])->getItem();
            } else {
                $row = $this->getService('com://admin/events.database.row.day');
            }

            $row->setData($day);
            $row->save();

            $ids[] = $row->id;
		}

		$this->setData(array(
			'days' => $ids,
		));
	}
}