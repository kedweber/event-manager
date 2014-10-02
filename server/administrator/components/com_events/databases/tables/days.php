<?php

class ComEventsDatabaseTableDays extends KDatabaseTableDefault
{
	public function _initialize(KConfig $config)
	{
		$relationable = $this->getBehavior('com://admin/taxonomy.database.behavior.relationable');

		$config->append(array(
			'behaviors' => array(
				'lockable',
				'creatable',
				'modifiable',
				'identifiable',
				'orderable',
				'sluggable',
				'com://admin/cck.database.behavior.elementable',
				$relationable,
				'com://site/redis.database.behavior.cacheable',
			)
		));

		parent::_initialize($config);
	}
}