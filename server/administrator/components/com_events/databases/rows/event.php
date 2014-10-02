<?php

defined('KOOWA') or die('Protected resource');

class ComEventsDatabaseRowEvent extends ComTaxonomyDatabaseRowDefault
{
    public function __construct(KConfig $config)
    {
        $this->_table = $config->table;

        parent::__construct($config);
    }

	/**
	 * @param $data
	 * @param bool $modified
	 * @return $this|KDatabaseRowAbstract
	 */
	public function setData($data, $modified = true)
	{
		parent::setData($data, $modified);

		if($this->days && !$this->start_date && ! $this->end_date) {
			$days = $this->days->toArray();

			$first = reset($days);
			$end = end($days);

			$this->start_date = strtotime($first['date']);
			$this->end_date = strtotime($end['date']);
		}

		return $this;
	}
}