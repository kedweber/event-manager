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
	protected function _actionRefresh(KCommandContext $context)
	{
		require JPATH_ROOT.'/vendor/autoload.php';
		Predis\Autoloader::register();

		$this->redis = new Predis\Client(array(
			'scheme' => 'tcp',
			'host'   => '127.0.0.1',
			'port'   => 6379,
		));

		$this->redis->flushall();

		$rows = $this->getModel()->limit(1000)->getList();

		$filter = $this->getService('koowa:filter.slug');

		foreach($rows as $row) {
			$this->redis->set('event:'.$row->id, serialize($row->toArray()));
			$this->redis->rpush('events', $row->id);
			$this->redis->sadd('ctas_involvement:'. $filter->sanitize($row->ctas_involvement), $row->id);

			$row->save();
		}
	}
}